'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthNavbar from '../../../components/AuthNavbar';
import { Icon } from '../../../components/Icons';

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' or 'teacher'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    // Common
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Student specific
    targetGoal: 'Hifz Memorization & Sanad',
    tajweedLevel: 'Beginner (Learning letters and Noorani Qaida)',
    studentDivision: 'brothers',

    // Teacher specific
    honorific: 'فضيلة الشيخ / Sheikh',
    teacherDivision: 'brothers',
    specialization: 'Hifz Memorization & Sanad',
    credentials: 'Ph.D. / Sanad in Quranic Sciences (Al-Azhar / Madinah / Befaq)',
    sanadCertification: 'Connected Chain back to the Prophet ﷺ (Sanad Mutawattir)',
    yearsExperience: '5+ years',
    ratePerClass: '30',
    bio: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Edge Case 1: Required validation
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMsg('Please enter your email address or mobile phone number.');
      return;
    }

    // Edge Case 2: Password mismatch
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both password fields.');
      return;
    }

    // Edge Case 3: Password length
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    // Edge Case 4: Terms agreement
    if (!agreedTerms) {
      setErrorMsg('Please agree to the Institute Honor Code and Learning Terms to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        role: selectedRole,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        ...(selectedRole === 'student'
          ? {
              targetGoal: formData.targetGoal,
              tajweedLevel: formData.tajweedLevel,
              division: formData.studentDivision,
            }
          : {
              honorific: formData.honorific,
              division: formData.teacherDivision,
              specialization: formData.specialization,
              credentials: formData.credentials,
              sanadCertification: formData.sanadCertification,
              yearsExperience: formData.yearsExperience,
              ratePerClass: Number(formData.ratePerClass) || 25,
              hourlyRate: Number(formData.ratePerClass) || 25,
              bio: formData.bio,
            }),
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to complete registration.');
        setIsSubmitting(false);
        return;
      }

      // Teacher Registration: Academic verification message
      if (selectedRole === 'teacher' || data.pendingApproval) {
        setSuccessMsg(
          `Alhamdulillah! Faculty application submitted for ${data.user.name}. Your academic credentials are under review by the Institute Administration. Redirecting to sign in...`
        );
        setTimeout(() => {
          router.push(data.redirectUrl || '/login?pendingApproval=true');
        }, 1500);
        return;
      }

      // Student Registration: Instant token & enrollment
      setSuccessMsg(
        `Alhamdulillah! Welcome to Our Quran Institute, ${data.user.name} (ID: ${data.user.id}). Opening your student dashboard...`
      );

      setTimeout(() => {
        router.push(data.redirectUrl || '/dashboard');
      }, 950);
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Could not connect to the registration service. Please verify your connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-ambient-glow" />
      <div className="auth-trellis-bg" />

      {/* Navigation Header */}
      <AuthNavbar />

      {/* Main Container */}
      <main className="auth-main-container">
        <div className="auth-card auth-card-wide">
          <div className="auth-card-corner-ornament">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>

          {/* Role Switcher Tabs */}
          <div className="auth-role-switcher-container">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`auth-role-tab-btn ${selectedRole === 'student' ? 'active' : ''}`}
              id="btn-register-role-student"
            >
              <Icon name="award" size={17} />
              <span>Student / Family Admission</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('teacher');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`auth-role-tab-btn ${selectedRole === 'teacher' ? 'active' : ''}`}
              id="btn-register-role-teacher"
            >
              <Icon name="book-open" size={17} />
              <span>Teacher / Scholar Application</span>
            </button>
          </div>

          {/* Dynamic Header */}
          <div className="auth-card-header">
            <div className="auth-card-badge">
              <Icon name={selectedRole === 'student' ? 'award' : 'shield-check'} size={13} color="#0D4A38" />
              <span>
                {selectedRole === 'student'
                  ? 'Institute Student & Family Admission'
                  : 'Faculty Accreditation & Teaching Application'}
              </span>
            </div>
            <h1 className="auth-card-title">
              {selectedRole === 'student'
                ? 'Register for Online Quran Learning'
                : 'Apply for Institute Faculty & Scholarship'}
            </h1>
            <p className="auth-card-subtitle">
              {selectedRole === 'student'
                ? 'Join 1-on-1 Quran classes with certified teachers, live Tajweed feedback, and continuous progress tracking.'
                : 'Join our global faculty of certified Huffaz & Tajweed scholars. Teach international students with verified Sanad and competitive compensation.'}
            </p>
          </div>

          {/* Contextual Policy Notice */}
          {selectedRole === 'student' ? (
            <div className="auth-notice-card student">
              <span style={{ marginTop: '2px', flexShrink: 0 }}>
                <Icon name="check-circle" size={17} color="#166534" />
              </span>
              <div>
                <strong>Instant Student Enrollment:</strong>
                <div style={{ color: '#15803D', marginTop: '2px' }}>
                  Student registrations are enrolled directly into the portal. You can choose your teacher, schedule evaluation sessions, and track your daily Hifz progress immediately.
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-notice-card teacher">
              <span style={{ marginTop: '2px', flexShrink: 0 }}>
                <Icon name="shield-check" size={17} color="#92400E" />
              </span>
              <div>
                <strong>Faculty Accreditation &amp; Sanad Review:</strong>
                <div style={{ color: '#B45309', marginTop: '2px' }}>
                  All scholar applications are verified by the Institute Academic Affairs committee. Once your Ijazah/Sanad credentials are confirmed, your public faculty profile goes live on the international directory.
                </div>
              </div>
            </div>
          )}

          {/* Alert feedback */}
          {errorMsg && (
            <div className="auth-alert-box auth-alert-error">
              <Icon name="alert-circle" size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert-box auth-alert-success">
              <Icon name="check-circle" size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Row 1: Name and Email/Phone */}
            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label" htmlFor="register-name">
                  {selectedRole === 'student' ? 'Full Name of Student / Applicant' : 'Full Name of Scholar / Teacher'}
                </label>
                <div className="form-input-container">
                  <span className="form-input-icon">
                    <Icon name="user" size={17} color="#0D4A38" />
                  </span>
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={selectedRole === 'student' ? 'e.g. Tariq Al-Mansoor' : 'e.g. Sheikh Dr. Ahmed Al-Azhari'}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-email">
                  Email Address or Mobile Number
                </label>
                <div className="form-input-container">
                  <span className="form-input-icon">
                    <Icon name="mail" size={17} color="#0D4A38" />
                  </span>
                  <input
                    id="register-email"
                    type="text"
                    inputMode="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com or 017XXXXXXXX"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone & Division / Program */}
            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label" htmlFor="register-phone">
                  Phone / WhatsApp Number (Required for Class Sync)
                </label>
                <div className="form-input-container">
                  <span className="form-input-icon">
                    <Icon name="phone" size={17} color="#0D4A38" />
                  </span>
                  <input
                    id="register-phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+880 1711-XXXXXX or UK/USA number"
                    className="form-input"
                  />
                </div>
              </div>

              {selectedRole === 'student' ? (
                <div className="form-group">
                  <label className="form-label" htmlFor="register-goal">
                    Learning Goal &amp; Program
                  </label>
                  <div className="form-input-container">
                    <select
                      id="register-goal"
                      name="targetGoal"
                      value={formData.targetGoal}
                      onChange={handleInputChange}
                      className="form-input form-select"
                    >
                      <option value="Hifz Memorization & Sanad">Hifz Memorization &amp; Sanad (হিফজ ও সনদ)</option>
                      <option value="Quran Reading Foundation & Noorani Qaida">Quran Reading Foundation &amp; Noorani Qaida (নূরানী কায়দা)</option>
                      <option value="Tajweed Rules & Arabic Makharij">Tajweed Rules &amp; Arabic Makharij (তাজবীদ ও মাখরাজ)</option>
                      <option value="Advanced 10 Qira’at Mastery">Advanced 10 Qira’at Mastery (দশ ক্বিরাআত)</option>
                      <option value="Kids Quran & Adab Circle">Kids Quran &amp; Adab Circle (ছোটদের কোরআন)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label" htmlFor="register-teacher-division">
                    Faculty Division
                  </label>
                  <div className="form-input-container">
                    <select
                      id="register-teacher-division"
                      name="teacherDivision"
                      value={formData.teacherDivision}
                      onChange={handleInputChange}
                      className="form-input form-select"
                    >
                      <option value="brothers">Brothers Section (পুরুষ শিক্ষক শাখা)</option>
                      <option value="sisters">Sisters Section (মহিলা শিক্ষিকা শাখা)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Role-Specific Row: Student Details vs Teacher Credentials */}
            {selectedRole === 'student' ? (
              <div className="form-row-two">
                <div className="form-group">
                  <label className="form-label" htmlFor="register-student-division">
                    Preferred Division
                  </label>
                  <div className="form-input-container">
                    <select
                      id="register-student-division"
                      name="studentDivision"
                      value={formData.studentDivision}
                      onChange={handleInputChange}
                      className="form-input form-select"
                    >
                      <option value="brothers">Brothers Section (Male Scholar)</option>
                      <option value="sisters">Sisters Section (Female Scholar)</option>
                      <option value="kids">Kids Quran Circle (Under 12)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-tajweed-level">
                    Current Quranic Background
                  </label>
                  <div className="form-input-container">
                    <select
                      id="register-tajweed-level"
                      name="tajweedLevel"
                      value={formData.tajweedLevel}
                      onChange={handleInputChange}
                      className="form-input form-select"
                    >
                      <option value="Beginner (Learning letters and Noorani Qaida)">Beginner (Learning Arabic letters / Noorani Qaida)</option>
                      <option value="Intermediate (Can read Mushaf with pauses)">Intermediate (Can read Mushaf, needs Tajweed polishing)</option>
                      <option value="Advanced (Hifz candidate / seeking Sanad)">Advanced (Memorizing Juz / seeking Ijazah &amp; Sanad)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="form-row-two">
                  <div className="form-group">
                    <label className="form-label" htmlFor="register-specialization">
                      Primary Teaching Specialization
                    </label>
                    <div className="form-input-container">
                      <select
                        id="register-specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="form-input form-select"
                      >
                        <option value="Hifz Memorization & Sanad">Hifz Memorization &amp; Sanad (হিফজ ও সনদ)</option>
                        <option value="Tajweed & Acoustic Makharij">Tajweed &amp; Acoustic Makharij (তাজবীদ ও মাখরাজ)</option>
                        <option value="Ten Qira’at Ijazah">Ten Qira’at Ijazah (দশ ক্বিরাআত ইজাজাহ)</option>
                        <option value="Quranic Arabic & Waqf Theory">Quranic Arabic &amp; Waqf Theory (কোরআনিক আরবি)</option>
                        <option value="Noorani Qaida for Kids">Noorani Qaida for Kids (ছোটদের নূরানী কায়দা)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="register-experience">
                      Years of Teaching Experience
                    </label>
                    <div className="form-input-container">
                      <select
                        id="register-experience"
                        name="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={handleInputChange}
                        className="form-input form-select"
                      >
                        <option value="2+ years">2+ Years Active Instruction</option>
                        <option value="5+ years">5+ Years Academic Instruction</option>
                        <option value="10+ years">10+ Years Senior Instruction</option>
                        <option value="15+ years">15+ Years Master Scholar</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label className="form-label" htmlFor="register-credentials">
                      Highest Academic Degree / Institution
                    </label>
                    <div className="form-input-container">
                      <input
                        id="register-credentials"
                        type="text"
                        name="credentials"
                        value={formData.credentials}
                        onChange={handleInputChange}
                        placeholder="e.g. Al-Azhar, Islamic Univ Madinah, Befaq"
                        className="form-input form-input-noicon"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="register-sanad">
                      Sanad / Ijazah Status
                    </label>
                    <div className="form-input-container">
                      <input
                        id="register-sanad"
                        type="text"
                        name="sanadCertification"
                        value={formData.sanadCertification}
                        onChange={handleInputChange}
                        placeholder="e.g. Connected Chain in Hafs ‘an ‘Asim"
                        className="form-input form-input-noicon"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Password Row */}
            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label" htmlFor="register-password">
                  Password
                </label>
                <div className="form-input-container">
                  <span className="form-input-icon">
                    <Icon name="lock" size={17} color="#0D4A38" />
                  </span>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="form-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-confirm-password">
                  Confirm Password
                </label>
                <div className="form-input-container">
                  <span className="form-input-icon">
                    <Icon name="lock" size={17} color="#0D4A38" />
                  </span>
                  <input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-type password"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Agreement Terms */}
            <div className="form-checkbox-row">
              <input
                type="checkbox"
                id="portal-terms-agree"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="portal-terms-agree" className="form-checkbox-text">
                I agree to the Institute Terms of Service, Academic Integrity Honor Code, and Privacy Policy.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-auth-submit"
              id="btn-complete-registration"
            >
              {isSubmitting ? (
                <span>Processing Application...</span>
              ) : selectedRole === 'student' ? (
                <>
                  <span>Complete Student Registration</span>
                  <Icon name="arrow-right" size={16} color="#FFDF85" />
                </>
              ) : (
                <>
                  <span>Submit Faculty Scholar Application</span>
                  <Icon name="arrow-right" size={16} color="#FFDF85" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card-footer">
            <p className="auth-footer-prompt">
              Already have an account?{' '}
              <Link href="/login" className="auth-footer-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
