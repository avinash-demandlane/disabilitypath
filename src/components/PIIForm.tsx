import { useState } from "react";
import { isValidUSPhone, isValidEmail, formatPhone } from "@/lib/validation";

interface PIIFormProps {
  onSubmit: (data: { firstName: string; lastName: string; email: string; phone: string }) => void;
  submitting?: boolean;
}

export default function PIIForm({ onSubmit, submitting }: PIIFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!isValidEmail(email)) errs.email = "Please enter a valid email";
    if (!phone.trim()) errs.phone = "Phone is required";
    else if (!isValidUSPhone(phone)) errs.phone = "Please enter a valid US phone number";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: formatPhone(phone),
    });
  }

  const inputCls =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-white text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-base";

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up">
      <h2 className="text-xl sm:text-2xl font-bold text-text mb-1">
        Almost there! Enter your details.
      </h2>
      <p className="text-text-muted text-sm mb-6">
        We'll connect you with a disability benefits specialist.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: "" })); }}
              className={inputCls}
            />
            {errors.firstName && <p className="text-danger text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setErrors((p) => ({ ...p, lastName: "" })); }}
              className={inputCls}
            />
            {errors.lastName && <p className="text-danger text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
            className={inputCls}
          />
          {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
            className={inputCls}
          />
          {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {submitting ? "Submitting…" : "Get My Free Evaluation"}
        </button>

        <p className="text-center text-text-muted/60 text-xs">
          By submitting, you agree to be contacted about disability benefits. We respect your privacy.
        </p>
      </div>
    </form>
  );
}
