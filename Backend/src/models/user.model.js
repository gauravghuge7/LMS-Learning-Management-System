import mongoose from 'mongoose';
import bcrypt from 'bcrypt';    
import JWT from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "fullName must be at least 5 characters long"],
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "email must be valid"]
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "password must be at least 6 characters long"],
        select: false
    },
    
    
    avatar: {
       public_id: {
        type: 'String',
       },
       secure_url: {
        type: 'String',
       }
    },

    forgotPasswordToken: {
        type: String,
        
    },
    forgotPasswordExpires: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'SUPERADMIN'],
        default: 'USER'
    }

    
    
}, {timeseries: true});



userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})


userSchema.methods = {
    generatetoken: async function() {

        return await JWT.sign(
            { id: this._id, role: this.role, subscription: this.subscription },
            process.env.JWT_SECRET,
            {
              expiresIn: '1d',
            }
        );
    },

    generatePasswordResetToken: async function() {
        const resetToken = await crypto.randomBytes(20).toString('hex');

        this.forgotPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        ;
        this.forgotPasswordExpires = Date.now() + (1000 * 60 * 15);

        return resetToken;
    }
}



const User = mongoose.model('User', userSchema);

export {
    User
}

