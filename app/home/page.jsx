import Homepage from "./homepage"
import Signing from "@/models/signing"
import connectMongoDB from "@/lib/dbConnect"

export default async function Page() {

    await connectMongoDB()

    const signingsObj = await Signing.find({})

    const signings = signingsObj.map((signing) => {
        return {
            id: String(signing._id),
            role: signing.role,
            propertyAddress: signing.propertyAddress,
            fileNumber: signing.fileNumber,
            signingLocation: signing.signingLocation,
            deliveryOption: signing.deliveryOption,
            expectedDeliveryDate: signing.expectedDeliveryDate,
            expectedDeliveryTime: signing.expectedDeliveryTime,
            notes: signing.notes,
        }
    })

    console.log(signings)

    return (
        <Homepage signings={signings} />
    )
}