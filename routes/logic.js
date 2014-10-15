var express = require('express');
var router = express.Router();
var userz = require('../models/userz.js');

router.get('/admin', userz.verifyAdmin, function(req, res) {
	res.render('logic/adminpanel');
});

router.get('/admin/adduser', userz.verifyAdmin, function(req, res) {
	res.render('logic/adminadduser')
});

router.post('/admin/newuser', userz.verifyAdmin, function(req, res) {
	userz.createUser(req.body.email, '', req.body.email, req.body.password,
		function(err, user) {
		}
	);
	req.flash('success', 'User Added');
	res.redirect('/logic/admin');
});

router.get('/admin/viewusers', userz.verifyAdmin, function(req, res) {
	userz.User.find({isAdmin: false}).sort({email: 1}).
					exec(function(err, users) {
		res.render('logic/adminviewusers', {'title': 'View Users', 'users': users})
	});
});

router.get('/admin/edituser/:uid', userz.verifyAdmin, function(req, res) {
	console.log(req.params.uid);
	userz.User.findById(req.params.uid, function(err, user) {
		console.log(user);
		res.render('logic/adminedituser', {'title': 'Edit User', 'u': user});
	});
	// userz.User.where({id: req.params.uid}).find(function(err, user) {
	// 	res.render('logic/adminedituser', {'title': 'Edit User', 'u': user});
	// }
});

router.post('/admin/updateuser/:uid', userz.verifyAdmin, function(req, res) {
	userz.User.findById(req.params.uid, function(err, user) {
		if (req.body.email)
			user.email = req.body.email;
		if (req.body.member1)
			user.member1.name = req.body.member1;
		if (req.body.member2)
			user.member2.name = req.body.member2;
		if (req.body.member3)
			user.member2.name = req.body.member3;

		if (req.body.password)
			userz.pbd(req.body.password, user.salt, 10000, function(result) {
				user.hash = result;
				user.save(function(err) {
					if (err) { console.log("Error in saving user"); }
				});
			});
		else
			user.save(function(err) {console.log(err);});
	});
	req.flash('success', 'Updated User');
	res.redirect('/logic/admin');
});

router.get('/general/edituser', userz.verify, function(req, res) {
	userz.User.findById(req.session.user._id, function(err, user) {
		// console.log(err);
		res.render('logic/generaledituser', {'user': user});
	});
	
});

router.post('/general/updateuser', userz.verify, function(req, res) {
	userz.User.findById(req.session.user._id, function(err, user) {
		if (req.body.member1)
			user.member1.name = req.body.member1;
		if (req.body.member2)
			user.member2.name = req.body.member2;
		if (req.body.member3)
			user.member3.name = req.body.member3;
		user.save(function(err) {console.log(err);});
	});
	req.flash('success', 'Updated User');
	res.redirect('/users/welcome');
});

router.get('/admin/removeuser/:uid', userz.verifyAdmin, function(req, res) {
	userz.User.findById(req.params.uid).remove(function(err) {});
	req.flash("success", "Removed User");
	res.redirect('/logic/admin');
});

module.exports = router;