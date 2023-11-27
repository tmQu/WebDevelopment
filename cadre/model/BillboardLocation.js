import mongoose from "mongoose";

var BillboardLocationSchema = mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    location: {
        lat:{
            type: Number,
            require: true
        },
        long: {
            type: Number,
            require: true
        }
    },

    addr: {
        NumStreet: {
            type: String,
            require: true
        },
        ward: {
            type: String,
            require: true
        },
        district: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        }
    },

    isPlan : {
        type: Boolean,
        require: true
    },
    size: {
        width: {
            type: Number,
            require: true
        },
        height: {
            type: Number,
            require: true
        },
        metric: {
            type: String,
            require: true
        }
    },

    advertismentType: {
        type: String,
        require: true
    },

    advertisementForm: {
        type: String,
        require: true
    },

    advertisementCategory: [
        /*
            [Đất công, công viên, Hành lang an toàn giao thông]
        */
    ],

    billboards: [
        /*
            { 
                img: [
                    img1,img2, img3
                ]
                date_expired:

            } -> Billboard 1,

            {
                img: [
                    img1,img2, img3
                ]
                date_expired:

            } -> BillBoard2,
        */ 
    ]
})

const BillboardLocation = mongoose.model('BillboardLocation', BillboardLocationSchema);

export default BillboardLocation