'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthdate: '',
    religion: '',
    address: '',
    profession: ''
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      toast.warn('Please fill all required fields')
      return false;
    }

    if (formData.password.length < 8) {
      toast.warn('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.warn('Passwords do not match');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.name || !formData.birthdate || !formData.religion) {
      toast.warn('Please fill all required fields')
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    setStep(step => Math.max(1, step - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address || !formData.profession) {
      toast.warn('Please fill all required fields')
      return;
    }

    try{
      setLoading(true);
      await register(formData);
      toast.success('Registration successful');
      router.push('/login');
    } catch (err: any){
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const religions = [
    'Islam', 'Christianity', 'Catholicism',
    'Hinduism', 'Buddhism', 'Confucianism', 'Other'
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
            step === num
              ? 'bg-gradient-to-r from-teal-500 to-teal-700 text-white'
              : step > num
              ? 'bg-teal-100 text-teal-700'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step > num ? <i className="bi bi-check"></i> : num}
          </div>
          {num < 3 && <div className={`w-12 h-1 ${step > num ? 'bg-teal-500' : 'bg-gray-200'}`}></div>}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">Account Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username<span className="text-red-500">*</span></label>
          <div className="relative">
            <i className="bi bi-person-fill absolute left-3 top-1/2 -translate-y-1/2 text-teal-500"></i>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
              placeholder="Choose a username"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
          <div className="relative">
            <i className="bi bi-lock-fill absolute left-3 top-1/2 -translate-y-1/2 text-teal-500"></i>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300`}
              placeholder="Create a password (min. 8 characters)"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password<span className="text-red-500">*</span></label>
          <div className="relative">
            <i className="bi bi-lock-fill absolute left-3 top-1/2 -translate-y-1/2 text-teal-500"></i>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300`}
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">Personal Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name<span className="text-red-500">*</span></label>
          <div className="relative">
            <i className="bi bi-person-badge absolute left-3 top-1/2 -translate-y-1/2 text-teal-500"></i>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date<span className="text-red-500">*</span></label>
          <div className="relative">
            <i className="bi bi-calendar-date absolute left-3 top-1/2 -translate-y-1/2 text-teal-500"></i>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Religion<span className="text-red-500">*</span></label>
          <div className="relative">
            <i className="bi bi-book absolute left-3 top-1/2 -translate-y-1/2 text-teal-500"></i>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300 bg-white"
              required
            >
              <option value="" disabled>Select your religion</option>
              {religions.map(religion => (
                <option key={religion} value={religion}>{religion}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">Additional Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address<span className="text-red-500">*</span></label>
          <div className="relative">
            <i className="bi bi-geo-alt absolute left-3 top-3 text-teal-500"></i>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
              placeholder="Enter your address"
              rows={3}
              required
            ></textarea>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profession<span className="text-red-500">*</span></label>
          <div className="relative">
            <i className="bi bi-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-teal-500"></i>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
              placeholder="Enter your profession"
              required
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-700 rounded-full mb-4">
              <i className="bi bi-person-plus-fill text-white text-2xl"></i>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">Please fill in the details to register</p>
        </div>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="w-full">
          {!loading && (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </>
          )}

          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          )}

          <div className={`flex gap-2 justify-end mt-6`}>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2 border border-teal-500 text-teal-500 rounded-lg font-bold hover:bg-teal-50 transition"
              >
                <i className="bi bi-arrow-left mr-1"></i> Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-lg font-bold hover:opacity-90 transition"
              >
                Next <i className="bi bi-arrow-right ml-1"></i>
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-lg font-bold hover:opacity-90 transition"
              >
                Register <i className="bi bi-check-circle ml-1"></i>
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
