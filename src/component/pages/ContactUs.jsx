import PageHeader from "../global/PageHeader";

export default function ContactUs() {
    return (
        <>
            <PageHeader title={"Contact Us"} />
            <div className="pt-8 md:pt-16">
                <div className="max-w-7xl mx-auto p-8 bg-white shadow-2xl rounded-3xl  relative z-20">
                    <h2 className="text-3xl font-semibold text-amber-600 mb-8 text-center">Contact Form</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Your Name" />
                        </div>
                        <div>
                            <input type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Your Email" />
                        </div>
                        <div className="md:col-span-2">
                            <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Your Message"></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <button className="w-40 p-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all active:scale-95">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="pt-8 md:pt-16">
                <div className="max-w-7xl mx-auto">
                    <div className="relative flex items-center mb-10">
                        <span className="pr-4 text-xl font-medium text-amber-600 shrink-0">Address</span>
                        <div className="grow border-t border-gray-300"></div>
                    </div>
                    <div>
                        <p className="text-base font-bold space-y-6 text-gray-700">Maganlal Chikki Products Pvt Ltd</p>
                        <p className="text-lg leading-relaxed">Shed No. 49A & B, Opp. Monsento LICEL, Nangargaon,<br /> Lonavala 410401 Dist. Pune</p>
                    </div>
                    <div className="space-y-2">
                        <p className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">Online store:</span>
                            <a href="https://www.maganlalchikki.in" className="text-amber-600 hover:underline">
                                www.maganlalchikki.in
                            </a>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">Ph. No.:</span> +912114274060
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="font-semibold text-gray-900">Mobile No.:</span> +917666530969
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">Contact Time:</span> 9 AM To 6 PM
                        </p>
                        <p className="font-semibold text-gray-900">
                            Factory Closed – Thursday
                        </p>
                        <p className="pb-4">
                            <a href="mailto:sales@maganlalchikki.in" className="text-amber-600 font-medium hover:text-amber-700">
                                sales@maganlalchikki.in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <div className="w-full h-150 px-6 pb-20 max-w-7xl mx-auto">
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.0883944641614!2d73.41505857501655!3d18.756247382384976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be8010aa3943343%3A0xb7f51664188b48f5!2sMaganlal%20Chikki!5e0!3m2!1sen!2sin!4v1709841234567!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Maganlal Chikki Lonavala Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    )
}