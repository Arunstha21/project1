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
  program: {
    type: String,
    required: true,
  },
  yearEnrolled: {
    type: Number,
    required: true,
  },
  loginInfo: { type: Schema.Types.ObjectId, ref: 'LoginInfo' },
  paymentInfo: { type: Schema.Types.ObjectId, ref: 'Payment'  }
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

const paymentSchema = new Schema({
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
    method: {
        type: String,
        enum: ['bank transfer', 'cash']
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
});


const LoginInfo = models.LoginInfo || model('LoginInfo', loginInfoSchema);
const MemberInfo = models.MemberInfo || model('MemberInfo', memberInfoSchema);
const StudentInfo = models.StudentInfo || model('StudentInfo', studentInfoSchema);
const StaffInfo = models.StaffInfo || model('StaffInfo', staffInfoSchema);
const Payment = models.Payment || model('Payment', paymentSchema);

export {LoginInfo, MemberInfo, StudentInfo, StaffInfo, Payment};
