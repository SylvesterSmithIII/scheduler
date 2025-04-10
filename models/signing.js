import mongoose, { Schema } from "mongoose";

const signingSchema = new Schema(
    {
        names: [{
            firstName: String,
            lastName: String
        }],
        role: String,
        propertyAddress: String,
        fileNumber: String,
        signingLocation: String,
        deliveryOption: String,
        expectedDeliveryDate: String,
        expectedDeliveryTime: String,
        notes: String,
       
      }, {
        timestamps: true
      }
)

const Signing = mongoose.models.Signing || mongoose.model("Signing", signingSchema);

export default Signing;
