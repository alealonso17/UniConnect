// THIS IS DE 'DATABASE' I WILL USE FOR STORING IMAGES AS STORING THEM IN SQL IS NOT OPTIMAL NOR RECCOMENDATED. 
//I WILL STORE THEM HERE AND GET LINKS THAT ILL STORE IN MYSQL 

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: 'dbepafbbt',
    api_key: '681485856353287',
    api_secret: 'vWmnF6a1cJTu-bSouQ3GPvrDwDw'
}); 

export default cloudinary; 