const bcrypt = require("bcrypt");
const { query } = require("express");
class Router {
	constructor(app, db) {
		this.login(app, db);
		this.logout(app, db);
		this.isLoggedIn(app, db);
		this.register(app, db);
		this.forumLoad(app,db);
		this.newPost(app,db);
		this.removePost(app,db);
	}
	login(app, db) {
		app.post("/login", (req, res) => {
			let username = req.body.username;
			let password = req.body.password;

			if (username.length > 15 || password.length > 15) {
				res.json({
					success: false,
					msg: "Error, please try again",
				});
				return;
			}
			let cols = [username];
			db.query(
				"select * from user where username=? Limit 1",
				cols,
				(err, data, fields) => {
					if (err) {
						res.json({
							success: false,
							msg: "Error, please try again",
						});
						return;
					}
					//found user
					if (data && data.length === 1) {
						bcrypt.compare(
							password,
							data[0].password,
							(bcryptErr, verified) => {
								if (verified) {
									req.session.userID = data[0].id;
									res.json({
										success: true,
										username: data[0].username,
										id:data[0].id
									});
									return;
								} else {
									res.json({
										success: false,
										msg: "Invalid password",
									});
								}
							}
						);
					} else {
						res.json({
							success: false,
							msg: "User not found",
						});
					}
				}
			);
		});
	}
	logout(app, db) {
		app.post("/logout", (req, res) => {
			if (req.session.userID) {
				req.session.destroy();
				res.json({
					success: true,
				});
			} else {
				res.json({
					success: false,
				});
				return false;
			}
		});
	}
	isLoggedIn(app, db) {
		app.post("/isLoggedIn", (req, res) => {
			if (req.session.userID) {
				let cols = req.session.userID;
				db.query(
					"select * from user where id=? Limit 1",
					cols,
					(err, data, fields) => {
						if (data && data.length === 1) {
							res.json({
								success: true,
								username: data[0].username,
								userID:data[0].id
							});
							return;
						} else {
							res.json({
								success: false,
							});
						}
					}
				);
			} else {
				res.json({
					success: false,
				});
			}
		});
	}
	register(app, db) {
		app.post("/register", (req, res) => {
			let username = req.body.username;
			let password = req.body.password;
			let email = req.body.email;

			let cols = [username];
			db.query(
				"select username from user where username=?",
				cols,
				(err, data, fields) => {
					if (err) {
						res.json({
							success: false,
							msg: "Error, please try again",
						});
						return;
					}
					if (data && data.length > 0) {
						res.json({
							success: false,
							msg: "Username already taken",
						});
						return;
					}
				}
			);
            let pwd = bcrypt.hashSync(password, 9);
            let query=`insert into user values (NULL,'${username}','${email}','${pwd}')`;
			db.query(query,
                (err,data,fields)=>{
                    if (err) {
                        res.json({
                            success:false,
                            msg:"Error on insert"
                        })
                    }
                }
			);
			db.query(
				"select * from user where username=? Limit 1",
				[username],
				(err, data, fields) => {
					if (err) {
						res.json({
							success: false,
							msg: "Error"
						});
						return;
					}
					if (data && data.length === 1) {
						req.session.userID = data[0].id;
						res.json({
							success: true,
							username: data[0].username,
							userID: data[0].id,
						});
						return;
					}
				}
			);
		});
	}
	forumLoad(app,db){
		app.post("/forum/load",(req,res)=>{
			let query="select p.id,p.body,p.user_id,u.username from post p inner join user u on p.user_id=u.id";
			db.query(query,(err,data,fields)=>{
				if(err){
					res.json({
						success:false
					})
					return;
				}
				if(data&& data.length>0){
					res.json({
						success:true,
						body:data
					})
				}
			})
		})
	}


	newPost(app,db){
		app.post("/forum/newpost",(req,res)=>{
			let userID=req.body.userID;
			let newpost=req.body.newpost;
			let query=`insert into post values (null,'${newpost}',${userID})`;
			db.query(query,(err,data,fields)=>{
				if(err){
					res.json({
						success:false
					});
				}else{
				res.json({
					success:true
				});
			}
			})
		});
	}
	removePost(app,db){
		app.post("/forum/remove",(req,res)=>{
			let postid=req.body.postid;
			let ownerid=req.body.ownerid;
			let query=`delete from post where id=${postid} and user_id=${ownerid}`;
			db.query(query,(err,data,fields)=>{
				if (err){
					res.json({
						success:false
					});
					return;
				}
				res.json({success:true});
			})
		})
	}
}
module.exports = Router;
