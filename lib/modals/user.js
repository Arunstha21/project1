import {Schema, model, models} from "mongoose";

const loginInfoSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    role: {
        type: String,
        enum: ["admin", "student", "staff"],
        required: true,
    },
  },
  { timestamps: true }
);

const memberInfoSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
    validate: {
        validator: function(v) {
            // Check if date of birth is in the past
            return v < new Date();
        },
        message: props => `${props.value} is not a valid date of birth!`
    }
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  contactNo: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // Validates if it's a 10-digit number
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Use Mongoose's built-in email validation
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  photo: {
    type: String,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  studentInfo: { type: Schema.Types.ObjectId, ref: 'StudentInfo' },
  staffInfo: { type: Schema.Types.ObjectId, ref: 'StaffInfo' },
});

const studentInfoSchema = new Schema({
  studentId: {
    type: String,
    required: true,
  },
  grade: { type: Schema.Types.ObjectId, ref: 'Grade' },
  yearEnrolled: {
    type: Number,
    required: true,
  },
  loginInfo: { type: Schema.Types.ObjectId, ref: 'LoginInfo' },
  feesRecord: { type: Schema.Types.ObjectId, ref: 'FeesRecordInfo'},
  esewaPaymentRecord : { type: Schema.Types.ObjectId, ref: 'EsewaPaymentInfo'}
});

const staffInfoSchema = new Schema({
  employeeId: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  loginInfo: { type: Schema.Types.ObjectId, ref: 'LoginInfo' },
});

const esewaPaymentRecord = new Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'StudentInfo',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    transactionCode: {
      type: String,
      require: true
    },
    transactionUuid: {
      type: String,
      require: true
    },
    grade: {
      type: Schema.Types.ObjectId,
      ref: 'Grade',
      required: true
    }

});

const feesRecord = new Schema({
  totalAmount: {
      type: Number,
      required: true
  },
  student: {
      type: Schema.Types.ObjectId,
      ref: 'StudentInfo',
      required: true
  },
  grade: {
    type: Schema.Types.ObjectId,
    ref: 'Grade',
    required: true
  }
});

const attendanceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'StudentInfo',
    required: true
  },
  present: {
    type: Boolean,
    default: false
  },
  day: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

const gradeSchema = new Schema({
  grade:{
    type: Number,
    require: true
  }
})

const Attendance = models.Attendance || model('Attendance', attendanceSchema);
const LoginInfo = models.LoginInfo || model('LoginInfo', loginInfoSchema);
const MemberInfo = models.MemberInfo || model('MemberInfo', memberInfoSchema);
const StudentInfo = models.StudentInfo || model('StudentInfo', studentInfoSchema);
const StaffInfo = models.StaffInfo || model('StaffInfo', staffInfoSchema);
const EsewaPaymentInfo = models.EsewaPaymentInfo || model('EsewaPaymentInfo', esewaPaymentRecord);
const GradeInfo = models.Grade || model('Grade', gradeSchema);
const FeesRecordInfo = models.FeesRecordInfo || model('FeesRecordInfo', feesRecord);

export {LoginInfo, MemberInfo, StudentInfo, StaffInfo, EsewaPaymentInfo, Attendance, GradeInfo, FeesRecordInfo};
