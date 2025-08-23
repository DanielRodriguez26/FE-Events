import { get } from '../settings/http.service';
import { BACKEND_ENDPOINTS } from '../settings/backend.config';


const myRegistrations = async () => {
    const response = await get({ 
		url: 'my-registrations', 
		baseURL: BACKEND_ENDPOINTS.eventRegistration,
	});
    return response;
};


const eventRegistrationServices = {
    myRegistrations,
};

export { eventRegistrationServices };