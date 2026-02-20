import ConnectDB from '@/DB/connectDB';
import Joi from 'joi';
import AppliedJob from '@/models/ApplyJob';
import validateToken from '@/middleware/tokenValidation';

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    about: Joi.string().required(),
    job: Joi.string().required(),
    user: Joi.string().required(),
    cv: Joi.string().uri().required(),
});


export default async (req, res) => {
    await ConnectDB();
    const { method } = req;
    switch (method) {
        case 'POST':
            await validateToken(req, res, async () => {
                await applyToJob(req, res);
            });
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}



const applyToJob =  async (req, res) => {
    await ConnectDB();

    try {
        const { name, email, about, job, user, cv } = req.body || {};

        const jobApplication = {
            name,
            email,
            about,
            job,
            user,
            cv,
        };

        const { error } = schema.validate(jobApplication);
        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message.replace(/['"]+/g, ''),
            });
        }

        await AppliedJob.create(jobApplication);
        return res.status(200).json({ success: true, message: 'Job application submitted successfully !' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'something went wrong please retry login !' });
    }
}

