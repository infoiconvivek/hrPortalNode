import Attendance from "../../models/Attendance.js";
import User from "../../models/User.js";
import Role from "../../models/Role.js";

class AttendanceController {
    // READ ALL DATA   
    static get = async (req, res) => {
        try {
            const data = await Attendance.find();

            if (data.length > 0) {
                res.status(200).send({
                    status: "success",
                    message: "All Data Show!!!",
                    data: data,
                });
            } else {
                res.status(404).send({
                    status: "failed",
                    message: "Data not found...!",
                });
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    };
    static getOneByUserId = async (req, res) => {
        try {
            var todayDate = new Date().toISOString().slice(0, 10);
            const data = await Attendance.find({
                user_id: req.params.id,
                in_time: { $gte: todayDate },
                //in_time: { $lt: todayDate }
            });
            if (data.length == 1) {
                return res.status(200).send(data[0]);
            } else {
                return res.status(404).send("Data not found...!");
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    };
    static getByUserId = async (req, res) => {
        try {
            const itemsPerPage = 30;
            const page = parseInt(req.query.page) || 1;
            const totalCount = await Attendance.countDocuments();
            const totalPages = Math.ceil(totalCount / itemsPerPage);

            const data = await Attendance.find({ user_id: req.params.id })
                .sort({ "_id": -1 })
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage);

            if (data.length > 0) {
                return res.status(200).send({ data, totalPages, currentPage: page });
            } else {
                return res.status(404).send("Data not found...!");
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    };
    // download attendance by user and date rage
    static downloadAttendance = async (req, res) => {
        const itemsPerPage = 500;
        try {
            const { id, start_date, end_date } = req.body;
            let data = [];

            const attendanceData = await Attendance.find({
                user_id: id,
                in_time: {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date)
                }
            })
                .populate('user_id', 'first_name last_name emp_id roles')
                //.sort({ "_id": -1 })
                .limit(500);

            /*const attendanceData = await Attendance.aggregate([
                {
                    $match: {
                        user_id: id,
                        in_time: {
                            $gte: new Date(start_date),
                            $lt: new Date(end_date)
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users', // Replace 'users' with the actual name of your user collection
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },

                {
                    $lookup: {
                        from: 'roles', // Replace 'roles' with the actual name of your role collection
                        localField: 'user.roles',
                        foreignField: '_id',
                        as: 'user.roles'
                    }
                },
                {
                    $project: {
                        'user.roles.name': 1,
                        'user.first_name': 1,
                        'user.last_name': 1,
                        'user.emp_id': 1,
                        'in_time': 1,
                        // Add other fields you want to include in the result
                    }
                },
                {
                    $limit: 500
                }
            ]);*/




            if (attendanceData.length > 0) {

                const user_role_id = attendanceData[0].user_id.roles[0];
                // Find the role by its ID
                const user_role = await Role.findById(user_role_id);
                let user_role_name = '';
                if (user_role) {
                    user_role_name = user_role.name; // Role name
                }
                const responseData = {
                    data: attendanceData,
                    userRoleName: user_role_name,
                };


                return res.status(200).send(responseData);
            } else {
                return res.status(404).send("Data not found...!");
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    };
    static downloadAllAttendance = async (req, res) => {
        const itemsPerPage = 500;
        try {
            const { start_date, end_date } = req.body;

            const data = await User.aggregate([
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'roles',
                        foreignField: '_id',
                        as: 'roleInfo',
                    },
                },
                {
                    $lookup: {
                        from: 'designations',
                        localField: 'designation',
                        foreignField: '_id',
                        as: 'designationInfo',
                    },
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'departmentInfo',
                    },
                },
                {
                    $lookup: {
                        from: 'attendances',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'attendanceData',
                    },

                },
                {
                    $unwind: '$attendanceData', // Unwind the attendanceData array
                },
                {
                    $match: {
                        'attendanceData.in_time': {
                            $gte: new Date(start_date),
                            $lte: new Date(end_date),
                        },
                    },
                },
                {
                    $match: {
                        'status': 1, // Add condition for user status
                    },
                },
                {
                    $project: {
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        phone: 1,
                        emp_id: 1,
                        designation: { $arrayElemAt: ['$designationInfo.name', 0] },
                        department: { $arrayElemAt: ['$departmentInfo.name', 0] },
                        role: '$roleInfo.name',
                        profile_img: 1,
                        attendanceData: 1,

                    },
                },
                {
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 },
                        data: { $push: '$$ROOT' },
                    },
                },

            ]);





            if (data.length > 0) {
                return res.status(200).send(data);
            } else {
                return res.status(404).send("Data not found...!");
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    }
    // CREAT
    static create = async (req, res) => {
        let data = {};
        try {
            if (req.body.status === "InTime") {
                let user_id = req.body.userId;
                var todayDate = new Date().toISOString().slice(0, 10);
                const oldAtt = await Attendance.findOne({ user_id, in_time: { $gte: todayDate } });

                if (oldAtt !== null) {
                    res.status(201).send({
                        status: "success",
                        message: "Attendance Allready punch"
                    });
                } else {
                    data.user_id = req.body.userId;
                    data.out_time = '';
                    data.ip = req.connection.remoteAddress;
                    const result = await Attendance.create(data);
                    res.status(200).send({
                        status: "success",
                        message: "Attendance insert successful!!!",
                        result: result,
                    });
                }
            } else {

                data.out_time = new Date();
                const result = await Attendance.findByIdAndUpdate(req.body.punchId, data);
                res.status(200).send({
                    status: "success",
                    message: "Attendance insert successful!!!",
                    result: result,
                });
            }


        } catch (error) {
            return res.status(404).send(error);
        }
    };

    static UpdateAttendance = async (req, res) => {
        try {
            const { att_id, in_time, outTime } = req.body;
            const data = await Attendance.findByIdAndUpdate(att_id, { out_time: outTime })
            return res.status(200).send({
                status: "success",
                message: "Attendance update successful!!!",
                data: data,
            });
        } catch (error) {
            return res.status(404).send(error);
        }
    }
    // DELETE
    static delete = async (req, res) => {
        try {
            const data = await Attendance.findByIdAndDelete(req.params.id, req.body);
            if (data) {
                res.status(200).send({
                    status: "success",
                    message: "Delete data Successful!!!",
                    data: data,
                });
            } else {
                res.status(404).send({
                    status: "failed",
                    message: "Data not Delete...!",
                });
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    };
}

export default AttendanceController;