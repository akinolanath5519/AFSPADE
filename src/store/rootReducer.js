import authReducer from "./authReducer";
import courseReducer from "./courseReducer";
import  assignmentReducer  from './assignmentReducer';



const rootReducer = {
  auth: authReducer,
  course: courseReducer,
  assignment: assignmentReducer,


};
export default rootReducer;
