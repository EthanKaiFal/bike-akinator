import { cookieBasedClient } from "@/utils/amplify-utils";
import { isAuthenticated } from "@/utils/amplify-utils";

const Bike = async({params}: { params: { id: string}}) => {
    if(!params.id) return null;

return (
    <div>
        
    </div>
    
);
};

export default Bike;