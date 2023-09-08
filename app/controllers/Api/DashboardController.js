import User from "../../models/User.js";
import Attendance from "../../models/Attendance.js";
import Leave from "../../models/Leave.js";

class DashboardController {





    static get = async (req, res) => {
        try {
            var todayDate = new Date().toISOString().slice(0, 10);

            const data = await User.find().countDocuments();
            const attendance = await Attendance.find({ in_time: { $gte: todayDate } }).countDocuments();
            const letComming = await Attendance.find({ in_time: { $gte: todayDate + 'T10:10:00' } }).countDocuments();
            const leave = await Leave.find({ from_date: { $gte: todayDate } }).countDocuments();

            return res.send({ 'total_employee': data, 'attendance': attendance, 'letComming': letComming, 'leave': leave });
            return res.send(data)
            if (data.length > 0) {
                return res.status(200).send({
                    status: "success",
                    message: "All Data Show!!!",
                    data: data,
                });
            } else {
                return res.status(404).send({
                    status: "failed",
                    message: "Data not found...!",
                });
            }
        } catch (error) {
            return res.status(404).send(error)
        }
    };


}

export default DashboardController;