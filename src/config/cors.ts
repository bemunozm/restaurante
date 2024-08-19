import { CorsOptions } from 'cors'
    
export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL]

        if (whitelist.includes(origin)) {
            return callback(null, true)
        } else {
            callback(new Error('ERROR DE CORS'))
        }
    }
}