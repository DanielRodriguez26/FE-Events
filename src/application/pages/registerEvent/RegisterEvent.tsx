import { useAuth } from "@/application/hooks";
import Layout from "@/application/layout/Layout";
import { useParams } from "react-router-dom";

const RegisterEvent = () => {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();

    console.log('User', user);
    console.log('Id', id);
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1>Register Event</h1>
            </div>
        </Layout>
    );
};

export default RegisterEvent;