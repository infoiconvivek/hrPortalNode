import User from "../../models/User.js";
import Role from "../../models/Role.js";
import Leave from "../../models/Leave.js"
import Attendance from "../../models/Attendance.js";
import path from "path";
import escapeHTML from "escape-html";
import bcrypt from "bcryptjs";
import multer from "multer";
class EmployeeController {
    static getAll = async (req, res) => {
        const uid = escapeHTML(req.params.id);
        try {

            let excludedUserIds = [uid]; // Add user IDs you want to exclude to this array
            //return res.status(200).send(excludedUserIds);
            //console.log("Excluded User IDs:", excludedUserIds);


            const usersWithAdminRole = await User.aggregate([
                {
                    $lookup: {
                        from: 'roles', // Name of the Role collection
                        localField: 'roles',
                        foreignField: '_id',
                        as: 'roleInfo'
                    }
                },
                {
                    $unwind: '$roleInfo' // Unwind the array
                },
                {
                    $match: {
                        'roleInfo.name': { $ne: 'Admin' }, // Exclude users with the "Admin" role
                        _id: { $nin: excludedUserIds } // Exclude users by _id
                    }
                },
                {
                    $match: {
                        //'status': 1, // Add condition for user status
                    },
                },
                {
                    $project: {
                        value: '$_id',
                        label: { $concat: ['$first_name', ' ', '$last_name'] }
                    }
                }
            ]);

            return res.status(200).send(usersWithAdminRole);
        } catch (error) {
            res.status(404).send(error);
        }
    };
    static getAllTlHr = async (req, res) => {
        try {
            //return res.status(200).send(excludedUserIds);
            //console.log("Excluded User IDs:", excludedUserIds);
            const usersWithAdminRole = await User.aggregate([
                {
                    $lookup: {
                        from: 'roles', // Name of the Role collection
                        localField: 'roles',
                        foreignField: '_id',
                        as: 'roleInfo'
                    }
                },
                {
                    $unwind: '$roleInfo' // Unwind the array
                },
                {
                    $match: {
                        'roleInfo.name': { $ne: 'Admin' }, // Exclude users with the "Admin" role
                        'roleInfo.name': { $ne: 'Employee' },
                    }
                },
                {
                    $match: {
                        //'status': 1, // Add condition for user status
                    },
                },
                {
                    $project: {
                        value: '$_id',
                        label: { $concat: ['$first_name', ' ', '$last_name'] }
                    }
                }
            ]);
            return res.status(200).send(usersWithAdminRole);
        } catch (error) {
            res.status(404).send(error);
        }
    };
    static get = async (req, res) => {

        try {
            const search = req.query.search || '';
            //return res.status(200).send(req.query.search);

            const itemsPerPage = 6;
            const page = parseInt(req.query.page) || 1;
            const totalCount = await User.countDocuments(
                [
                    {
                        $lookup: {
                            from: 'roles', // Name of the Role collection
                            localField: 'roles',
                            foreignField: '_id',
                            as: 'roleInfo'
                        }
                    },
                    {
                        $unwind: '$roleInfo' // Unwind the array
                    },
                    {
                        $match: {
                            'roleInfo.name': { $ne: 'Admin' } // Exclude users with the "Admin" role

                        }
                    }


                ]
            );
            const totalPages = Math.ceil(totalCount / itemsPerPage);

            const data = await User.aggregate
                ([
                    {
                        $lookup: {
                            from: 'roles', // Name of the Role collection
                            localField: 'roles',
                            foreignField: '_id',
                            as: 'roleInfo'
                        }
                    },
                    {
                        $unwind: '$roleInfo' // Unwind the array
                    },
                    {
                        $match: {
                            'roleInfo.name': { $ne: 'Admin' }, // Exclude users with the "Admin" role
                            $or: [
                                { first_name: { $regex: search, $options: 'i' } }, // Case-insensitive search in first_name
                                { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search in last_name
                                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search in email
                                { phone: { $regex: search, $options: 'i' } }, // Case-insensitive search in phone
                            ]
                        }
                    },

                    {
                        $lookup: {
                            from: 'designations', // Replace 'designations' with the actual collection name
                            localField: 'designation', // Assuming 'designation' is the foreign key in the 'users' collection
                            foreignField: '_id', // Assuming '_id' is the primary key in the 'designations' collection
                            as: 'designationInfo',
                        },
                    },
                    {
                        $lookup: {
                            from: 'departments', // Replace 'departments' with the actual collection name
                            localField: 'department', // Assuming 'department' is the foreign key in the 'users' collection
                            foreignField: '_id', // Assuming '_id' is the primary key in the 'departments' collection
                            as: 'departmentInfo',
                        },
                    },
                    {
                        $project: {
                            first_name: 1,
                            last_name: 1,
                            email: 1,
                            phone: 1,
                            join_data: 1,
                            emp_id: 1,
                            designation: { $arrayElemAt: ['$designationInfo.name', 0] }, // Assuming 'name' is the field in 'designations'
                            department: { $arrayElemAt: ['$departmentInfo.name', 0] }, // Assuming 'name' is the field in 'departments'
                            profile_img: 1,
                            status: 1

                        },
                    },
                    { $skip: (page - 1) * itemsPerPage },
                    { $limit: itemsPerPage },

                ]);

            if (data.length > 0) {
                res.status(200).send({ data, totalPages, currentPage: page });
            } else {
                res.status(404).send("Data not found...!");
            }
        } catch (error) {
            res.status(404).send(error);
        }
    };




    static getEmpAttendance = async (req, res) => {

        try {
            //return res.status(200).send(req.query.month);

            const currentMonth = Number(req.query.month) + 1;
            //const currentMonth = Number(req.params.month) + 1;
            //const currentMonth = new Date().getMonth() + 1;            
            const currentYear = Number(req.query.year);
            /*const data = await User.aggregate([
                {
                    $lookup: {
                        from: 'attendances',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'attendanceInfo',
                    },
                },
                {
                    $project: {
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        phone: 1,
                        emp_id: 1,
                        designation: 1,
                        department: 1,
                        profile_img: 1,
                        attendanceInfo: {
                            $filter: {
                                input: '$attendanceInfo',
                                as: 'attendance',
                                cond: {
                                    $and: [
                                        { $eq: [{ $year: '$$attendance.in_time' }, currentYear] },
                                        { $eq: [{ $month: '$$attendance.in_time' }, currentMonth] },
                                    ],
                                },
                            },
                        },
                    },
                },
            ]);*/
            const itemsPerPage = 5;
            const page = parseInt(req.query.page) || 1;
            const totalCount = await User.countDocuments();
            const totalPages = Math.ceil(totalCount / itemsPerPage);

            const data = await User.aggregate([
                {
                    $lookup: {
                        from: 'roles', // Name of the Role collection
                        localField: 'roles',
                        foreignField: '_id',
                        as: 'roleInfo'
                    }
                },
                {
                    $unwind: '$roleInfo' // Unwind the array
                },
                {
                    $match: {
                        'roleInfo.name': { $ne: 'Admin' }, // Exclude users with the "Admin" role
                        //_id: { $nin: excludedUserIds } // Exclude users by _id
                    }
                },
                {
                    $match: {
                        'status': 1, // Add condition for user status
                    },
                },
                {
                    $lookup: {
                        from: 'attendances',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'attendanceInfo',
                    },
                },
                {
                    $lookup: {
                        from: 'designations', // Replace 'designations' with the actual collection name
                        localField: 'designation', // Assuming 'designation' is the foreign key in the 'users' collection
                        foreignField: '_id', // Assuming '_id' is the primary key in the 'designations' collection
                        as: 'designationInfo',
                    },
                },
                {
                    $lookup: {
                        from: 'departments', // Replace 'departments' with the actual collection name
                        localField: 'department', // Assuming 'department' is the foreign key in the 'users' collection
                        foreignField: '_id', // Assuming '_id' is the primary key in the 'departments' collection
                        as: 'departmentInfo',
                    },
                },
                {
                    $project: {
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        phone: 1,
                        join_data: 1,
                        emp_id: 1,
                        designation: { $arrayElemAt: ['$designationInfo.name', 0] }, // Assuming 'name' is the field in 'designations'
                        department: { $arrayElemAt: ['$departmentInfo.name', 0] }, // Assuming 'name' is the field in 'departments'
                        profile_img: 1,
                        roles: '$roleInfo',
                        attendanceInfo: {
                            $filter: {
                                input: '$attendanceInfo',
                                as: 'attendance',
                                cond: {
                                    $and: [
                                        { $eq: [{ $year: '$$attendance.in_time' }, currentYear] },
                                        { $eq: [{ $month: '$$attendance.in_time' }, currentMonth] },
                                    ],
                                },
                            },
                        },
                    },
                },
                { $skip: (page - 1) * itemsPerPage },
                { $limit: itemsPerPage },

            ]);

            if (data.length > 0) {
                res.status(200).send({ data, totalPages, currentPage: page });
            } else {
                res.status(404).send("Data not found...!");
            }
        } catch (error) {
            res.status(404).send(error);
        }
    };
    static getById = async (req, res) => {
        const uid = escapeHTML(req.params.id);
        try {
            const data = await User.findById(uid);
            //const data = await User.find((user) => user.id == uid);
            if (data) {
                return res.status(200).send(data);
            } else {
                return res.status(404).send("Data not found...!");
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    };
    static getLeaveById = async (req, res) => {
        const uid = escapeHTML(req.params.id);
        try {
            const data = await User.findById(uid).select('leaves');
            //const data = await User.find((user) => user.id == uid);
            if (data) {
                return res.status(200).send(data);
            } else {
                return res.status(404).send("Data not found...!");
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    };
    static view = async (req, res) => {
        const uid = escapeHTML(req.params.id);

        try {
            const data = await User.findById(uid).populate("designation").populate("department");
            const userRole = await User.aggregate([
                {
                    $match: { _id: data._id } // Match the user ID
                },
                {
                    $lookup: {
                        from: 'roles', // Name of the roles collection
                        localField: 'roles', // Field in the User collection
                        foreignField: '_id', // Field in the Roles collection
                        as: 'rolesInfo' // Field to add role information
                    }
                },
                {
                    $unwind: '$rolesInfo' // Unwind the array of roles
                },
                {
                    $group: {
                        _id: '$_id',
                        roles: { $push: '$rolesInfo.name' }, // Push role names into an array
                        // Other fields you may want to include (e.g., first_name, last_name, etc.)
                        // Add them here similar to: first_name: { $first: '$first_name' }
                    }
                }
            ]);


            const leaves = await Leave.find({ user_id: uid }).sort({ _id: -1 });
            const currentMonth = new Date().getMonth() + 1;
            const filteredData = leaves.filter(leave => {
                const fromMonth = leave.from_date.getMonth() + 1; // Adding 1 because getMonth() returns a zero-based index
                const toMonth = leave.to_date.getMonth() + 1; // Adding 1 for the same reason

                return (
                    (fromMonth === currentMonth || toMonth === currentMonth) &&
                    leave.hr_approve === 'Approve' &&
                    leave.tl_approve === 'Approve'
                );
            });

            let totalDaysDiff = 0;

            filteredData.forEach(leave_data => {
                let daysDiff;
                if (leave_data.leave_type === 'Short Leave') {
                    daysDiff = 0.5;
                } else if (leave_data.leave_type === 'Half Day Leave') {
                    daysDiff = 0.25;
                } else {
                    const toDate = leave_data.to_date;
                    const fromDate = leave_data.from_date;
                    const diff = Math.abs(toDate - fromDate);
                    const daysDiff1 = diff / (1000 * 60 * 60 * 24);
                    daysDiff = daysDiff1 + 1;
                }

                totalDaysDiff += daysDiff;
            });

            //console.log(filteredData);
            if (data) {
                return res.status(200).send({ data: data, leavesList: leaves, totalLeaveCurrentMonth: totalDaysDiff, roles: userRole });
            } else {
                return res.status(404).send("Data not found...!");
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    };
    static create = async (req, res) => {
        let encryptedPassword; let roles = []; let path;
        let login_user_role = await Role.findById(req.user.roles)

        // Our register logic starts here
        try {
            // Get user input
            const { user_id, first_name, last_name, email, password, company,
                emp_id,
                join_data,
                phone,
                department,
                designation,
                description,
            } = req.body;

            //const { filename, path } = req.file;
            if (req.file) {
                path = req.file.path.split('/').slice(1).join('/');
            }
            // Save the image metadata and additional fields to the database            

            // Validate user input
            if (!(email && first_name && last_name && department && designation)) {
                return res.status(400).send("All input is required");
            }

            if (user_id) {

                if (login_user_role.name === 'Admin') {
                    roles[0] = req.body.role
                }
                let update_data = {};
                update_data.first_name = first_name;
                update_data.last_name = last_name;
                update_data.email = email.toLowerCase();

                if (password) {
                    encryptedPassword = await bcrypt.hash(password, 10);
                    update_data.password = encryptedPassword;
                }

                if (path) {
                    update_data.profile_img = path;
                }

                update_data.company = company;
                update_data.emp_id = emp_id;
                update_data.join_data = join_data;
                update_data.phone = phone;
                if (department) {
                    update_data.department = department;
                }
                if (designation) {
                    update_data.designation = designation;
                }
                update_data.description = description;
                if (roles.length > 0) {
                    update_data.roles = roles;
                }

                await User.findByIdAndUpdate(user_id, update_data);
                return res.status(200).send('User Profile updated successfully');
            } else {

                if (login_user_role.name === 'Admin') {
                    if (req.body.role) {
                        roles = [req.body.role]
                    } else {
                        const type = 'Employee';
                        const roleData = await Role.findOne({ name: type })
                        roles = [roleData._id]
                    }
                } else {
                    const type = 'Employee';
                    const roleData = await Role.findOne({ name: type })
                    roles = [roleData._id]
                }

                // check if user already exist
                // Validate if user exist in our database
                const oldUser = await User.findOne({ email });

                if (oldUser) {
                    return res.status(409).send("User Already Exist. Please Login");
                }
                //Encrypt user password
                encryptedPassword = await bcrypt.hash(password, 10);

                // Create user in our database
                const user = await User.create({
                    first_name,
                    last_name,
                    email: email.toLowerCase(), // sanitize: convert email to lowercase
                    password: encryptedPassword,
                    profile_img: path ? path : '',
                    company,
                    emp_id,
                    join_data,
                    phone,
                    department,
                    designation,
                    description,
                    roles
                });
                // return new user
                return res.status(200).send('User Created Successfully');
            }



        } catch (err) {
            return res.status(400).send(err);
        }
        // Our register logic ends here
    }
    static update = async (req, res) => {
        let path;
        const uid = escapeHTML(req.params.id);

        // Our register logic starts here
        try {
            const { first_name, last_name, email, phone } = req.body;
            let user = await User.findOne({ _id: uid });
            //const { filename, path } = req.file;
            if (req.file) {
                path = req.file.path.split('/').slice(1).join('/');
            }

            // Save the image metadata and additional fields to the database            

            // Validate user input


            if (user) {

                let update_data = {};
                update_data.first_name = first_name;
                update_data.last_name = last_name;
                update_data.email = email.toLowerCase();
                update_data.phone = phone;

                if (path) {
                    update_data.profile_img = path;
                }
                const udata = await User.findByIdAndUpdate(uid, update_data);
                return res.status(200).send(udata);
            } else {
                return res.status(204).send('Old password not match!');
            }



        } catch (err) {
            return res.status(400).send(err);
        }
        // Our register logic ends here
    }
    static updatePassword = async (req, res) => {
        let encryptedPassword; let roles; let path;
        const uid = escapeHTML(req.params.id);
        const oldPassword = req.body.oldPassword;

        // Our register logic starts here
        try {

            let user = await User.findOne({ _id: uid });
            // let pass = user.password;
            // return res.status(201).send({ pass, oldPassword });

            //const { filename, path } = req.file;
            // if (req.files) {
            //     path = req.file.path.split('/').slice(1).join('/');
            // }
            // Save the image metadata and additional fields to the database            

            // Validate user input
            if (!(req.body.password)) {
                return res.status(400).send("All input is required");
            }

            if (user && (await bcrypt.compare(oldPassword, user.password))) {

                let update_data = {};
                //update_data.first_name = first_name;
                //update_data.last_name = last_name;
                //update_data.email = email.toLowerCase();

                if (req.body.password) {
                    encryptedPassword = await bcrypt.hash(req.body.password, 10);
                    update_data.password = encryptedPassword;
                }

                // if (path) {
                //     update_data.profile_img = path;
                // }


                const udata = await User.findByIdAndUpdate(uid, update_data);
                return res.status(200).send(udata);
            } else {
                return res.status(202).send('Old password not match!');
            }



        } catch (err) {
            return res.status(400).send(err);
        }
        // Our register logic ends here
    }
    static changeStatus = async (req, res) => {
        const uid = escapeHTML(req.params.id);
        // Our register logic starts here
        try {
            let update_data = {};
            update_data.status = req.body.status;
            const udata = await User.findByIdAndUpdate(uid, update_data);
            return res.status(200).send(udata);
        } catch (err) {
            return res.status(400).send(err);
        }

    }
    static remove = async (req, res) => {
        try {
            await Leave.deleteMany({ user_id: req.params.id });
            await Attendance.deleteMany({ user_id: req.params.id });
            const data = await User.deleteOne({ _id: req.params.id });

            if (data) {
                return res.status(200).send('success');
            } else {
                return res.status(404).send('failed');
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    }
}
export default EmployeeController;