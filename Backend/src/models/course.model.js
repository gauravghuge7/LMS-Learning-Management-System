
import { description } from "commander";
import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({ 
    title: {
        type: String
    },

    description: {
        type: String 
    },

    category: {
        type: String
    },
    thumbnail: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },

    lectures: [
        {
            title: String,
            description: String,
            lectures: {
                public_id: {
                    type: String
                },
                secure_url: {
                    type: String
                }
            }
        }
    ],
    numberOfLecture: {
        type: Number
    },

    createdBy: {
        type: String
    }




}, {timestamps: true})


export const Course = mongoose.model("Courses", courseSchema);