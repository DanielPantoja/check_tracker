const checks = require('../controllers/checks');
const checkAuth = require('../middleware/check-auth');

module.exports = (app) => {
    //Login/SignUp
        app.post("/api/user/create", (req, res) => checks.createUser(req, res));
        app.post("/api/user/login", (req, res) => checks.loginUser(req, res));
    //Post Functions
        app.post("/api/job/create", checkAuth, (req, res) => checks.createJob(req, res));
        app.post("/api/check/create", checkAuth, (req, res) => checks.createCheck(req, res));
        app.post("/api/entry/create", checkAuth, (req, res) => checks.createEntry(req, res));
    //Get Functions
        app.get("/api/user/:uId", checkAuth, (req,res) => checks.getAllUserData(req,res));
        //Job
        app.get("/api/job/data/:jId", checkAuth,(req,res) => checks.getJobData(req,res));
        app.get("/api/job/:jId", checkAuth, (req, res) => checks.getOneJob(req, res));
        //Check
        app.get("/api/check/data/:cId", checkAuth, (req, res) => checks.getCheckData(req,res));
        app.get("/api/allChecks/:uId", checkAuth, (req,res) => checks.getAllChecks(req,res));
        app.get("/api/check/:cId", checkAuth, (req, res) => checks.getOneCheck(req, res));
        //Entry
        app.get("/api/allEntrys/:uId", checkAuth,(req,res) => checks.getAllEntrys(req,res));
        app.get("/api/entry/:eId", checkAuth, (req, res) => checks.getOneEntry(req, res)); 
    //Edit Functions 
        app.put("/api/job/edit/:uId/:jId", checkAuth, (req, res) => checks.editJob(req, res));
        app.put("/api/check/edit/:jId/:cId", checkAuth, (req, res) => checks.editCheck(req, res));
        app.put("/api/entry/edit/:eId", checkAuth, (req, res) => checks.editEntry(req, res));
    //Delete Functions
        app.delete("/api/job/delete/:uId/:jId", checkAuth, (req, res) => checks.deleteJob(req, res));
        app.delete("/api/check/delete/:cId/:jId", checkAuth, (req, res) => checks.deleteCheck(req, res));
        app.delete("/api/entry/delete/:cId/:eId", checkAuth, (req, res) => checks.deleteEntry(req, res));
}
