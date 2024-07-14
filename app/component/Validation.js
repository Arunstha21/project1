import formFields from "@/app/component/formFields.json";

export default function Validate(id, title, value=""){
    if (formFields.validation[id] && value==="") {
        return (`${title} is required`);
    }else if (id === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return (`Invalid ${title}`);
        }
    } else if (id === "fullName" && title === "Full Name") {
        const fullNameRegex = /^[a-zA-Z\s]+$/;
        if (!fullNameRegex.test(value)) {
            return (`Invalid ${title}`);
        }
    } else if (id === "contactNo" && title === "Contact No.") {
        const contactNoRegex = /^(98|97)\d{8}$/;
        if (!contactNoRegex.test(value)) {
            return (`Invalid ${title}`);
        }
    } else if (id === "enrolledYear" && title === "Enrolled Year") {
        const enrolledYearRegex = /^(19|20)\d{2}$/;
        if (!enrolledYearRegex.test(value)) {
            return (`Invalid ${title}`);
        }
    } else if (id === "dateOfBirth" && title === "Date of Birth") {
        const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dobRegex.test(value)) {
            return (`Invalid ${title}`);
        } else {
            // Calculate age from date of birth
            const dob = new Date(value);
            const currentDate = new Date();
            const ageDiff = currentDate.getFullYear() - dob.getFullYear();
            if (ageDiff < 3) {
                return (`Child should be at least 3 years old`);
            }
        }
    } else {
        return;
    }
}