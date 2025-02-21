import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY,{
    apiVersion: "2020-08-27"
})

export const createPaymentIntent = async(req,res)=>{
    const {amount, currency} = req.body

    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency
        })

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        })
    }
    catch(error){
        console.error("Error creating payment intent: ",error)
        res.status(500).send({error:"Failed to create payment intent"})
    }

}


