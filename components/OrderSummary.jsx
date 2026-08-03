import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react'
import AddressModal from './AddressModal';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const OrderSummary = ({ totalPrice, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const router = useRouter();

    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    const handleCouponCode = async (event) => {
        event.preventDefault();
        if (couponCodeInput.trim().toUpperCase() === 'NEW20') {
            setCoupon({ code: 'NEW20', discount: 20 });
            toast.success('Promo code applied successfully!');
            setCouponCodeInput('');
        } else {
            toast.error('Invalid promo code');
        }
    }

    const handlePlaceOrder = (e) => {
        e.preventDefault();

        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        const promise = new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
            router.push('/orders');
        });

        toast.promise(promise, {
            loading: 'Processing your bespoke order...',
            success: 'Order placed successfully!',
            error: 'Failed to process order'
        });
    }

    return (
        <div className='w-full bg-[#FAF9F6] shadow-xl border border-[#E0DCD3] flex flex-col font-sans relative overflow-hidden'>

            {/* Torn Receipt Top Edge */}
            <div className="absolute top-0 left-0 right-0 h-2 opacity-50" style={{ background: "radial-gradient(circle at 5px 0, transparent 5px, #EAE5DB 6px) repeat-x", backgroundSize: "10px 10px" }}></div>

            <div className="pt-5 px-5 pb-3 border-b-2 border-dashed border-[#D0C8B8]">
                <h2 className="font-serif text-lg tracking-widest text-[#2C241B] uppercase text-center mb-1">Bespoke Order</h2>
                <p className="text-[7px] tracking-[0.3em] uppercase text-[#8b795a] text-center font-bold">Invoice & Details</p>
            </div>

            <div className="p-5 flex flex-col gap-4 font-mono text-xs text-[#4A4238]">
                <div className='flex justify-between items-end'>
                    <span className="uppercase tracking-widest text-[8px] text-[#8b795a] font-bold">Meters ({items.length})</span>
                    <span className="font-sans text-[#2C241B] font-medium">{currency}{totalPrice.toLocaleString()}</span>
                </div>

                <div className='flex justify-between items-end'>
                    <span className="uppercase tracking-widest text-[8px] text-[#8b795a] font-bold">Discount</span>
                    <span className="font-sans text-[#A89F8D]">- {currency}0</span>
                </div>

                <div className='flex justify-between items-end'>
                    <span className="uppercase tracking-widest text-[8px] text-[#8b795a] font-bold">Shipping</span>
                    <span className="font-sans text-[#8b795a] font-medium uppercase text-[8px] tracking-widest">Complimentary</span>
                </div>

                {coupon && (
                    <div className='flex justify-between items-end'>
                        <span className="flex items-center gap-2 uppercase tracking-widest text-[8px] text-[#8b795a] font-bold">Coupon
                            <button onClick={() => setCoupon('')} className="text-[#A89F8D] hover:text-red-800"><XIcon size={12} /></button>
                        </span>
                        <span className="font-sans text-[#8b795a] font-medium">- {currency}{(coupon.discount / 100 * totalPrice).toFixed(2)}</span>
                    </div>
                )}

                <div className='pt-4 mt-1 border-t-2 border-dashed border-[#D0C8B8] flex justify-between items-end pb-1'>
                    <span className="font-serif text-sm text-[#2C241B] uppercase tracking-wider">Total</span>
                    <span className="text-xl font-serif text-[#2C241B]">
                        {currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}
                    </span>
                </div>

                {/* Promo Code */}
                {!coupon && (
                    <form onSubmit={handleCouponCode} className='flex gap-2 mt-2 font-sans'>
                        <input type="text" placeholder='PROMO CODE' value={couponCodeInput} onChange={e => setCouponCodeInput(e.target.value)} className='flex-1 px-3 py-2 bg-white border border-[#E0DCD3] rounded-none focus:outline-none focus:border-[#8b795a] text-[9px] text-[#2C241B] uppercase tracking-wider transition-colors placeholder-[#A89F8D]' required />
                        <button type="submit" className='bg-[#F5F2EA] border border-[#E0DCD3] text-[#8b795a] font-bold text-[8px] uppercase tracking-widest hover:bg-[#EAE5DB] hover:text-[#2C241B] px-3 py-2 transition-colors'>Apply</button>
                    </form>
                )}

                {/* Delivery Address Section */}
                <div className="border-t-2 border-dashed border-[#D0C8B8] pt-4 mt-1 font-sans">
                    <p className='text-[8px] font-bold text-[#8b795a] uppercase tracking-widest mb-2 font-mono'>Delivery Details</p>
                    {
                        selectedAddress ? (
                            <div className='flex justify-between items-start'>
                                <p className="text-[10px] text-[#2C241B] pr-4 leading-loose font-medium">
                                    {selectedAddress.name}<br />
                                    <span className="font-normal text-[#7A6B52]">{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}</span>
                                </p>
                                <button onClick={() => setSelectedAddress(null)} className='text-[#8b795a] hover:text-[#2C241B] uppercase tracking-widest text-[8px] font-bold underline underline-offset-4 transition-colors font-mono'>
                                    Edit
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {
                                    addressList.length > 0 && (
                                        <select className='w-full px-3 py-2 bg-white border border-[#E0DCD3] rounded-none focus:outline-none focus:border-[#8b795a] text-[10px] text-[#2C241B] transition-colors' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                            <option value="">Select Address</option>
                                            {
                                                addressList.map((address, index) => (
                                                    <option key={index} value={index}>{address.name}, {address.city}</option>
                                                ))
                                            }
                                        </select>
                                    )
                                }
                                <button onClick={() => setShowAddressModal(true)} className='self-start text-[#2C241B] text-[8px] font-bold uppercase tracking-widest underline underline-offset-4 hover:text-[#8b795a] transition-colors font-mono'>
                                    New Address
                                </button>
                            </div>
                        )
                    }
                </div>

                {/* Payment Method Section */}
                <div className="border-t-2 border-dashed border-[#D0C8B8] pt-4 font-sans">
                    <p className='text-[8px] font-bold text-[#8b795a] uppercase tracking-widest mb-2 font-mono'>Payment Method</p>
                    <div className="flex flex-col gap-2">
                        <label className='flex gap-3 items-center cursor-pointer group'>
                            <div className={`w-3 h-3 border flex items-center justify-center transition-colors ${paymentMethod === 'COD' ? 'border-[#2C241B] bg-[#2C241B]' : 'border-[#D0C8B8] bg-white'}`}>
                                {paymentMethod === 'COD' && <XIcon size={8} className="text-white" />}
                            </div>
                            <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='hidden' />
                            <span className="text-[10px] font-medium text-[#2C241B] uppercase tracking-wider">Cash on Delivery</span>
                        </label>
                        <label className='flex gap-3 items-center cursor-pointer group'>
                            <div className={`w-3 h-3 border flex items-center justify-center transition-colors ${paymentMethod === 'STRIPE' ? 'border-[#2C241B] bg-[#2C241B]' : 'border-[#D0C8B8] bg-white'}`}>
                                {paymentMethod === 'STRIPE' && <XIcon size={8} className="text-white" />}
                            </div>
                            <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='hidden' />
                            <span className="text-[10px] font-medium text-[#2C241B] uppercase tracking-wider">Credit Card</span>
                        </label>
                    </div>
                </div>
            </div>

            <button onClick={handlePlaceOrder} className='w-full bg-[#2C241B] hover:bg-black text-white py-4 transition-colors text-[10px] font-bold uppercase tracking-[0.3em] font-sans border-t border-black'>
                Finalize Order
            </button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
        </div>
    )
}

export default OrderSummary