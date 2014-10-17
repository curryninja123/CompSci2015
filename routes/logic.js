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

function compareTeams(a, b) {
	if (a.email.length < b.email.length) return -1;
	if (a.email.length > b.email.length) return 1;
	if (a.email < b.email) return -1;
	if (a.email > b.email) return 1;
	return 0;
}

router.get('/admin/viewusers', userz.verifyAdmin, function(req, res) {
	userz.User.find({isAdmin: false}).
					exec(function(err, users) {
		res.render('logic/adminviewusers', {'title': 'View Users', 'users': users.sort(compareTeams)})
	});
});

router.get('/admin/edituser/:uid', userz.verifyAdmin, function(req, res) {
	// console.log(req.params.uid);
	userz.User.findById(req.params.uid, function(err, user) {
		// console.log(user);
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
			user.member3.name = req.body.member3;

		if (req.body.school)
			user.school = req.body.school;

		if (req.body.wmember1)
			user.member1.written = parseInt(req.body.wmember1);
		if (req.body.wmember2)
			user.member2.written = parseInt(req.body.wmember2);
		if (req.body.wmember3)
			user.member3.written = parseInt(req.body.wmember3);

		if (req.body.password)
			userz.pbd(req.body.password, user.salt, 10000, function(result) {
				user.hash = result;
				user.save(function(err) {
					if (err) { console.log("Error in saving user (1)"); }
				});
			});
		else
			user.save(function(err) {console.log("Error in Saving User (2)");});
	});
	req.flash('success', 'Updated User');
	res.redirect('/logic/admin/viewusers');
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

		if (req.body.school)
			user.school = req.body.school;

		user.save(function(err) {if (err) console.log(err);});
	});
	req.flash('success', 'Updated User');
	res.redirect('/users/welcome');
});

router.get('/general/written', userz.verify, function(req, res) {
	userz.User.findById(req.session.user._id, function(err, user) {
		res.render('logic/generalwrittenscores', {'user': user});
	});
});

function memberCompare(a,b) {
  if (a.written < b.written)
     return 1;
  if (a.written > b.written)
    return -1;
  return 0;
}

router.get('/admin/viewnovicescores', userz.verifyAdmin, function(req, res) {
	userz.User.find({isAdmin: false}).where('email').lte('team40').exec(function(err, userlist) {
		var members = [];
		for (var x = 0; x < userlist.length; x++) {
			if (userlist[x].member1.name) {
				members[members.length] = userlist[x].member1;
				members[members.length - 1].team = userlist[x].email;
				members[members.length - 1].school = userlist[x].school;
			}
			if (userlist[x].member2.name) {
				members[members.length] = userlist[x].member2;
				members[members.length - 1].team = userlist[x].email;
				members[members.length - 1].school = userlist[x].school;
			}
			if (userlist[x].member3.name) {
				members[members.length] = userlist[x].member3;
				members[members.length - 1].team = userlist[x].email;
				members[members.length - 1].school = userlist[x].school;
			}
		}
		members.sort(memberCompare);

		res.render('logic/adminnovicescoreboard', {
			title: 'Written Scores | Novice',
			members: members
		});
	});
});

router.get('/admin/viewadvancedscores', userz.verifyAdmin, function(req, res) {
	userz.User.find({isAdmin: false}).where('email').gte('team41').exec(function(err, userlist) {
		var members = [];
		for (var x = 0; x < userlist.length; x++) {
			if (userlist[x].member1.name) {
				members[members.length] = userlist[x].member1;
				members[members.length - 1].team = userlist[x].email;
				members[members.length - 1].school = userlist[x].school;
			}
			if (userlist[x].member2.name) {
				members[members.length] = userlist[x].member2;
				members[members.length - 1].team = userlist[x].email;
				members[members.length - 1].school = userlist[x].school;
			}
			if (userlist[x].member3.name) {
				members[members.length] = userlist[x].member3;
				members[members.length - 1].team = userlist[x].email;
				members[members.length - 1].school = userlist[x].school;
			}
		}
		members.sort(memberCompare);
	
		res.render('logic/adminnovicescoreboard', {
			title: 'Written Scores | Advanced',
			members: members
		});
	});
});

router.get('/admin/removeuser/:uid', userz.verifyAdmin, function(req, res) {
	userz.User.findById(req.params.uid).remove(function(err) {});
	req.flash("success", "Removed User");
	res.redirect('/logic/admin');
});

module.exports = router;