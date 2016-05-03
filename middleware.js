module.exports = function (db) {
 	return {
 		requireAuthentication: function (req,res,next) {
 			var token = req.get('Auth');
			console.log('in requireAuthentication , token ');
			console.log(token);
 			db.user.findByToken(token).then(function (user) {
 				console.log('findByToken, success');
 				req.user = user;
 				next();
 			},function (){
 				console.log('findByToken, reject');
 				res.status(401).send();
 			}); 
 		}
 	};
};