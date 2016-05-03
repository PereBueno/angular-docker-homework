# Booking portal exercise

The "Booking portal" is an application with the purpose of
creating payment bookings. It consists on a payment form with the following structure:

![alt tag](https://s3.amazonaws.com/f.cl.ly/items/3V2d3S1P2R231j3c0H2j/Screen%20Shot%202015-04-09%20at%2001.51.19.png)

When the form is submitted, the application creates a payment record with the provided information.

This application also has an API consisting of 2 endpoints that are detailed on the [Readme](server/README.md).

Please develop a second application, inside the ``client`` directory, that communicates with the "booking portal" application in order to accomplish the following:

When a payment is booked, this payment has to go through a "quality check", the purpose of this quality check is to assure that the payment meets some defined "quality" criteria, this criteria consists on the following rules:

* **InvalidEmail**: The payment has an invalid email.
* **DuplicatedPayment**: The user that booked the payment has already a payment in the system.
* **AmountThreshold**: The amount of the payment is bigger than 1.000.000$

The application should show if any of this "quality check" criteria are not met.

Besides "quality check", we also want to check for "over" and "under" payments [1]:

* An **over-payment** happens when the user pays more than the tuition amount we introduced in the booking portal.
* An **under-payment** is just the opposite.

As in the quality check, we want the application to show if the payment is an "over" or an "underpayment".
As a final step, we want to add to the amount some fees depending on the magnitude of the amount, this fees are:

* if the amount < 1000 USD: 5% fees
* if the amount > 1000 USD AND < 10000 USD: 3% fees
* if the amount > 10000 USD: 2% fees

Here you can see an example on how this information could be displayed:

![alt tag](https://s3.amazonaws.com/f.cl.ly/items/2b2G2P2W1U2l3a0Y3y0F/Screen%20Shot%202015-04-09%20at%2001.38.45.png)

### Notes

We don't expect changes to be made on the server application. It should be treated as an external application owned by someone else.

How to implement the client application is totally up to you.

You can implement the client application in the programming language of your preference.
