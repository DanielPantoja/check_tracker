require('../models/user'); //might not need all of these const User = require("../models/user");
require('../models/job');
require('../models/entry');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Job = mongoose.model('Job');
const Check = mongoose.model('Check');
const Entry = mongoose.model('Entry');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: (req, res) => {//this function orginally used 401 codes
        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length >= 1) {//need to test this to make sure it doesnt crash app
                    return res.status(404).json({ message: "User with this email exists" })//User with this email exists 
                }
                if (req.body.password.length <= 7) {
                    return res.status(404).json({ message: "Password must be atleast 8 charcters" })
                }
                else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(404).json({ message: "Error creating hashed password for User" })
                        }
                        else {
                            const user = new User(
                                {
                                    _id: new mongoose.Types.ObjectId(),
                                    first_name: req.body.first_name,
                                    last_name: req.body.last_name,
                                    email: req.body.email,
                                    password: hash
                                });
                            user.save()
                                .then(() => {//test to see if this works or do i need to use a variable like result 
                                    const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_KEY, { expiresIn: "1h" });
                                    return res.status(200).json({ token: token, expiresIn: 3600, userId: user._id })
                                })
                                .catch(err => {
                                    return res.status(404).json({ message: 'Internal database error, sorry', error: err.errors })
                                }
                            )
                        }
                    })
                }
            })
            .catch(err => {
                return res.status(404).json({ message: 'Internal database error, cannot find User', error: err.errors })
            })
    },
    loginUser: (req, res) => {
        let fetchedUser;
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return
                }
                fetchedUser = user;
                return bcrypt.compare(req.body.password, user.password);
            })
            .then(result => {
                if (!result) {
                    console.log(err)
                    return res.status(404).json({ message: 'Invalid Credentialss' })
                }
                const token = jwt.sign(
                    { email: fetchedUser.email, userId: fetchedUser._id },
                    process.env.JWT_KEY,
                    { expiresIn: "1h" }
                );
                return res.status(200).json({ token: token, expiresIn: 3600, userId: fetchedUser._id });
            })
            .catch(err => {
                //at this part max would change the authstatuslistner
                console.log(err)
                return res.status(404).json({ message: 'Invalid Credentials', error: err })
            });
    },
    //***********************CREATES***********************
    createJob: (req, res) => {//should this create and update user that way it can fail as a whol
        Job.create(req.body).then(job => {
            User.findByIdAndUpdate({ _id: req.body.uId }, { $push: { jobs: job } })
                .then(result => {
                    return res.status(200).json({ results: result })
                })
                .catch(err => {
                    job.delete()//deletes job since it wont be on a users job array for whatever reason need to test if it works
                    return res.status(404).json({ message: 'Failed to update user job list', error: err.errors })
                })
        })
            .catch(err => {
                return res.status(404).json({ message: "Failed to create job", error: err.errors })
            })
    },
    createCheck: (req, res) => {
        Check.create(req.body).then(check => {
            Job.findByIdAndUpdate({ _id: req.body.jobId }, { $push: { checks: check } })
                .then(result => {
                    return res.status(200).json({ results: result })
                })
                .catch(err => {
                    return res.status(404).json({ message: "Failed to update check list", error: err.errors })
                })
        })
            .catch(err => {
                return res.status(404).json({ message: "Failed to create check", error: err.errors })
            })
    },
    createEntry: (req, res) => {
        Job.findOne({ 'checks._id': req.body.checkId }).then(job => {
            req.body.jobId = job._id;
            Entry.create(req.body)
                .then(entry => {
                    Check.findOneAndUpdate({ _id: req.body.checkId }, { $push: { entrys: entry } })
                        .then(result => {
                            return res.status(200).json({ results: result, jId: job._id })
                        })
                        .catch(err => {
                            return res.status(404).json({ message: 'Failed to update check list', error: err.errors })
                        })
                })
                .catch(err => {
                    return res.status(404).json({ message: 'Failed to create entry', error: err.errors })
                })
        })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to find job ID to create entry', error: err.errors })
            })
    },
    //***********************GETS***********************
    getOneJob: (req, res) => {
        Job.findById({ _id: req.params.jId })
            .then(job => {
                return res.status(200).json({ results: job })
            })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to get job', error: err.errors })
            })
    },
    getOneCheck: (req, res) => {
        Check.findById({ _id: req.params.cId })
            .then(check => {
                return res.status(200).json({ results: check })
            })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to get check', error: err.errors })
            })
    },
    getOneEntry: (req, res) => {
        Entry.findById({ _id: req.params.eId })
            .then(entry => {
                return res.status(200).json({ results: entry })
            })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to get entry', error: err.errors })
            })
    },
    //***********************EDITS***********************
    editJob: (req, res) => {
        Job.findByIdAndUpdate({ _id: req.params.jId }, req.body, { runValidators: true })
            .then(() => {
                User.findOneAndUpdate({ _id: req.params.uId, "jobs._id": req.params.jId },
                    {
                        $set: {
                            "jobs.$.title": req.body.title,
                            "jobs.$.payrate": req.body.payrate,
                            "jobs.$.taxrate": req.body.taxrate,
                        }
                    })
                    .then(result => {
                        return res.status(200).json({ results: result })
                    })
                    .catch(err => {
                        return res.status(404).json({ message: "Failed to update user job data", error: err.errors })
                    })
            })
            .catch(err => {
                return res.status(404).json({ message: "Failed to update job", error: err.errors })
            })
    },
    editCheck: (req, res) => {
        Job.findOneAndUpdate({ 'checks._id': req.body.cId, 'checks._id': req.params.cId },
            {
                $set:
                {
                    "checks.$.start": req.body.start,
                    "checks.$.end": req.body.end
                }
            })
            .then(() => {
                Check.findByIdAndUpdate({ _id: req.params.cId }, req.body, { runValidators: true })
                    .then(result => {
                        return res.status(200).json({ results: result });
                    })
                    .catch(err => {
                        return res.status(404).json({ message: 'Failed to update check inside job data', error: err.errors })
                    })
            })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to update check ', error: err.errors })
            })
    },
    editEntry: (req, res) => {
        Check.findOneAndUpdate({ "entrys._id": req.params.eId, "entrys._id": req.params.eId },
            {
                $set:
                {
                    "entrys.$.hours": req.body.hours,
                    "entrys.$.minutes": req.body.minutes,
                    "entrys.$.date": req.body.date
                }
            })
            .then(() => {
                Entry.findByIdAndUpdate({ _id: req.params.eId }, req.body, { runValidators: true })
                    .then(result => {
                        return res.status(200).json({ results: result })
                    })
                    .catch(err => {
                        return res.status(404).json({ message: 'Failed to update entry', error: err.errors })
                    })
            })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to update entry', error: err.errors })
            })
    },
    //***********************DELETES***********************
    deleteJob: (req, res) => {
        Job.deleteOne({ _id: req.params.jId })
            .then(User.findOneAndUpdate({ _id: req.params.uId }, { $pull: { jobs: { _id: req.params.jId } } })
                .then(Check.deleteMany({ jobId: req.params.jId })
                    .then(Entry.deleteMany({ jobId: req.params.jId })
                        .then(result => {
                            return res.status(200).json({ results: result })
                        })
                        .catch(err => {
                            return res.status(404).json({ message: "Failed to delete job", error: err.errors })
                        })
                    )
                )
                .catch(err => {
                    return res.status(404).json({ message: "Failed to delete job", error: err.errors })
                })
            )
            .catch(err => {
                return res.status(404).json({ message: "Failed to delete job", error: err.errors })
            })
    },
    deleteCheck: (req, res) => {
        Check.deleteOne({ _id: req.params.cId })
            .then(Job.findOneAndUpdate({ _id: req.params.jId }, { $pull: { checks: { _id: req.params.cId } } })
                .then(Entry.deleteMany({ checkId: cId })//need to test this 
                    .then(result => {
                        return res.status(200).json({ results: result })
                    })
                    .catch(err => {
                        return res.status(404).json({ message: "Failed to delete check", errors: err.errors })
                    })
                )
                .catch(err => {
                    return res.status(404).json({ message: "Failed to delete check", errors: err.errors })
                })
            )
            .catch(err => {
                return res.status(404).json({ message: "Failed to delete check", errors: err.errors })
            })
    },
    deleteEntry: (req, res) => {
        Entry.deleteOne({ _id: req.params.eId })
            .then(Check.findOneAndUpdate({ _id: req.params.cId }, { $pull: { entrys: { _id: req.params.eId } } })
                .then(result => {
                    return res.status(200).json({ results: result })
                })
                .catch(err => {
                    return res.status(404).json({ message: "Failed to delete entry", errors: err.errors })
                })
            )
            .catch(err => {
                return res.status(404).json({ message: "Failed to delete entry", errors: err.errors })
            })
    },
    //***********************COMPLICATED_GETS*********************** BELOW IS THE OG FUNCTION
    getAllUserData: (req, res) => {
        let timeTotal = 0;
        let earningTotal = 0;
        dataArray = [];
        User.findById({ _id: req.params.uId }).then(user => {
            if (user.jobs.length > 0) {
                user.jobs.forEach((element) => {
                    Entry.find({ jobId: element._id }).then(entrys => {
                        entrys.sum = function (array, key) {
                            return array.reduce(function (a, b) {
                                return a + b[key];
                            }, 0)
                        }, 0;
                        timeTotal += (entrys.sum(entrys, 'hours') + (entrys.sum(entrys, 'minutes') / 60));
                        earningTotal += (entrys.sum(entrys, 'hours') + (entrys.sum(entrys, 'minutes') / 60)) * (element.payrate);
                        let dataObject = { title: element.title, payrate: element.payrate, taxrate: element.taxrate, grossTotal: (entrys.sum(entrys, 'hours') + (entrys.sum(entrys, 'minutes') / 60)) * (element.payrate), netTotal: ((entrys.sum(entrys, 'hours') + entrys.sum(entrys, 'minutes') / 60) * element.payrate) - (entrys.sum(entrys, 'hours') + entrys.sum(entrys, 'minutes') / 60) * element.payrate * (element.taxrate * .01), timeTotal: (entrys.sum(entrys, 'hours') + (entrys.sum(entrys, 'minutes') / 60)), id: element._id };
                        dataArray.push(dataObject);
                        if (dataArray.length == user.jobs.length) {
                            return res.status(200).json({ results: dataArray, timeTotal, earningTotal })
                        }
                    })
                        .catch(err => {
                            return res.status(404).json({ message: 'Failed to get user data', error: err.errors })
                        })
                })
            }
            else {
                return res.status(200).json({ results: dataArray, timeTotal, earningTotal })
            }
        })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to get user data', error: err.errors })
            })
    },
    getJobData: (req, res) => {
        let timeTotal = 0;
        let earningTotal = 0;
        checkArray = [];
        Job.findById({ _id: req.params.jId }).then(job => {
            if (job.checks.length > 0) {
                job.checks.forEach((element, index, array) => {
                    Check.findById(element._id).then(check => {
                        check.sum = function (array, key) {
                            return array.reduce(function (a, b) {
                                return a + b[key]
                            }, 0)
                        }, 0
                        let checkData = { start: check.start, end: check.end, id: check._id, timeTotal: check.sum(check.entrys, 'hours') + check.sum(check.entrys, 'minutes') / 60, netTotal: ((check.sum(check.entrys, 'hours') + check.sum(check.entrys, 'minutes') / 60) * job.payrate), grossTotal: ((check.sum(check.entrys, 'hours') + check.sum(check.entrys, 'minutes') / 60) * job.payrate) - (check.sum(check.entrys, 'hours') + check.sum(check.entrys, 'minutes') / 60) * job.payrate * (job.taxrate * .01) }
                        checkArray.push(checkData);
                        if (index == array.length - 1) {
                            Entry.find({ jobId: req.params.jId }).then(entrys => {
                                entrys.sum = function (array, key) {
                                    return array.reduce(function (a, b) {
                                        return a + b[key]
                                    }, 0)
                                }, 0
                                earningTotal = (entrys.sum(entrys, 'hours') + entrys.sum(entrys, 'minutes') / 60) * job.payrate;
                                timeTotal = entrys.sum(entrys, 'hours') + entrys.sum(entrys, 'minutes') / 60;
                                return res.status(200).json({ results: job, checkArray, earningTotal, timeTotal })
                            })
                                .catch(err => {
                                    console.log(err)
                                    return res.status(404).json({ message: 'Failed to get job data', error: err.errors })
                                })
                        }
                    })
                        .catch(err => {
                            return res.status(404).json({ message: 'Failed to get job data', error: err.errors })
                        })
                })
            }
            else {
                return res.status(200).json({ results: job, checkArray, earningTotal, timeTotal })
            }
        })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to get job data', error: err.errors })
            })
    },
    getCheckData: (req, res) => {
        let timeTotal = 0;
        let earningTotal = 0;
        entryArray = [];
        Job.findOne({ 'checks._id': req.params.cId }).then(job => {
            Check.findById(req.params.cId).then(check => {
                if (check.entrys.length > 0) {
                    check.entrys.forEach((element, index, array) => {
                        let entryData = { id: element._id, date: element.date, timeTotal: element.hours + (element.minutes / 60), netTotal: (element.hours + (element.minutes / 60)) * job.payrate, grossTotal: ((element.hours + (element.minutes / 60)) * job.payrate) - ((element.hours + (element.minutes / 60)) * job.payrate * (job.taxrate * .01)) }
                        entryArray.push(entryData);
                        if (index == array.length - 1) {
                            check.sum = function (array, key) {
                                return array.reduce(function (a, b) {
                                    return a + b[key]
                                }, 0)
                            }, 0
                            earningTotal = (check.sum(check.entrys, ['hours']) + check.sum(check.entrys, ['minutes']) / 60) * job.payrate;
                            timeTotal = check.sum(check.entrys, ['hours']) + check.sum(check.entrys, ['minutes']) / 60;
                            return res.status(200).json({ results: entryArray, earningTotal, timeTotal })
                        }
                    })
                }
                else {
                    return res.status(200).json({ results: entryArray })
                }
            })
                .catch(err => {
                    return res.status(404).json({ message: 'Failed to get check data', error: err.errors })
                })
        })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to get check data', error: err.errors })
            });
    },
    getAllChecks: (req, res) => {
        let checkArray = [];
        let checkQuantity = 0;
        User.findById({ _id: req.params.uId }).then(user => {
            user.jobs.forEach((element, index, array) => {
                if (user.jobs.length > 0) {
                    Job.findById(element._id).then(job => {
                        checkQuantity += job.checks.length;
                        if (job.checks.length > 0) {
                            job.checks.forEach((element2, index2, array2) => {
                                Check.findById(element2._id).then(check => {
                                    if (check.entrys.length > 0) {
                                        check.sum = function (arrayy, key) {
                                            return arrayy.reduce(function (a, b) {
                                                return a + b[key]
                                            }, 0)
                                        }, 0
                                        let checkData = { title: job.title, id: check._id, jobId: check.jobId, start: check.start, end: check.end, timeTotal: check.sum(check.entrys, 'hours') + check.sum(check.entrys, 'minutes') / 60, netTotal: ((check.sum(check.entrys, 'hours') + check.sum(check.entrys, 'minutes') / 60) * job.payrate), grossTotal: ((check.sum(check.entrys, 'hours') + check.sum(check.entrys, 'minutes') / 60) * job.payrate) - (check.sum(check.entrys, 'hours') + check.sum(check.entrys, 'minutes') / 60) * job.payrate * (job.taxrate * .01) }
                                        checkArray.push(checkData);
                                        if (checkQuantity == checkArray.length) {
                                            return res.status(200).json({ results: checkArray })
                                        }
                                    }
                                    else {
                                        let checkData = { title: job.title, id: check._id, jobId: check.jobId, start: check.start, end: check.end, timeTotal: 0, netTotal: 0, grossTotal: 0 }
                                        checkArray.push(checkData);
                                        if (index == array.length - 1 && index2 == array2.length - 1 && checkQuantity == checkArray.length) {
                                            return res.status(200).json({ results: checkArray })
                                        }
                                    }
                                })
                                    .catch(err => {
                                        return res.status(404).json({ message: 'Failed to retrieve checks data', error: err.errors })
                                    })
                            })
                        }
                        else {
                            if (index == array.length - 1 && checkQuantity == checkArray.length) {
                                return res.status(200).json({ results: checkArray })
                            }
                        }
                    })
                        .catch(err => {
                            return res.status(404).json({ message: 'Failed to retrieve checks data', error: err.errors })
                        })
                }
                else {
                    return res.status(200).json({ results: checkArray })
                }
            })
        })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to retrieve checks data', error: err.errors })
            })
    },
    getAllEntrys: (req, res) => {
        let entryArray = [];
        let entryQuantity = 0;
        User.findById({ _id: req.params.uId }).then(user => {
            if (user.jobs.length > 0) {
                user.jobs.forEach((element) => {
                    Entry.find({ 'jobId': element._id }).then(entrys => {
                        entryQuantity += entrys.length
                    })
                        .catch(err => {
                            return res.status(404).json({ message: 'Failed to retrieve data', error: err.errors })
                        })
                })
            }
            else {
                return res.status(200).json({ results: entryArray })
            }
            return user.jobs
        }).then(jobs => {
            jobs.forEach((element) => {
                Job.findById(element._id).then(job => {
                    if (job.checks.length > 0) {
                        job.checks.forEach((element2) => {
                            Check.findById(element2._id).then(check => {
                                if (check.entrys.length > 0) {
                                    check.entrys.forEach((element3 => {
                                        let entryData = { job: job.title, id: element3._id, date: element3.date, timeTotal: element3['hours'] + (element3['minutes'] / 60), grossTotal: (element3['hours'] + (element3['minutes'] / 60)) * element.payrate, netTotal: ((element3['hours'] + element3['minutes'] / 60) * element.payrate) - (((element3['hours'] + element3['minutes'] / 60) * element.payrate) * (element.taxrate * .01)) }
                                        entryArray.push(entryData);
                                        if (entryQuantity == entryArray.length) {
                                            return res.status(200).json({ results: entryArray })
                                        }
                                    })
                                )}
                            })
                                .catch(err => {
                                    return res.status(404).json({ message: 'Failed to retrieve data', error: err.errors })
                                })
                        })
                    }
                })
                    .catch(err => {
                        return res.status(404).json({ message: 'Failed to retrieve data', error: err.errors })
                    })
            })
        })
            .catch(err => {
                return res.status(404).json({ message: 'Failed to retrieve data', error: err.errors })
            })
    }
}