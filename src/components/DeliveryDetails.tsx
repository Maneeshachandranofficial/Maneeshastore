'use client';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MapPin, Plus, ChevronDown, Check } from 'lucide-react';

export interface Delivery {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export const EMPTY_DELIVERY: Delivery = { name: '', phone: '', address: '', city: '', state: '', pincode: '' };

// A readymade order needs a real shipping address. Complete = all fields present,
// phone ≥10 digits, pincode ≥6 digits.
export function isDeliveryComplete(d: Delivery): boolean {
  return Boolean(
    d.name.trim() &&
      d.phone.replace(/\D/g, '').length >= 10 &&
      d.address.trim() &&
      d.city.trim() &&
      d.state.trim() &&
      d.pincode.replace(/\D/g, '').length >= 6
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;
const field = 'w-full rounded-full border border-charcoal/15 bg-cream px-5 py-3 font-sans text-sm font-light text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-maroon';
const label = 'mb-2 block text-[10px] uppercase tracking-[0.2em] text-charcoal/50';

export default function DeliveryDetails({
  value,
  onChange,
  open,
  onOpenChange,
}: {
  value: Delivery;
  onChange: (d: Delivery) => void;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const reduce = useReducedMotion();
  const set = (k: keyof Delivery) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...value, [k]: e.target.value });
  const complete = isDeliveryComplete(value);

  // Subtle staggered rise of the fields as the panel opens.
  const container = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: 0.05 } } };
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  };

  return (
    <div className="mt-10">
      {/* Trigger / header — click to reveal the fields */}
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between rounded-2xl border border-charcoal/15 bg-cream px-6 py-5 text-left transition-colors hover:border-maroon"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/60 transition-colors group-hover:border-maroon group-hover:text-maroon">
            {complete ? <Check className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
          </span>
          <span className="flex flex-col">
            <span className="font-sans text-[12px] uppercase tracking-[0.2em] text-charcoal transition-colors group-hover:text-maroon">
              {complete ? 'Delivery Address' : 'Add Delivery Address'}
            </span>
            <span className="mt-0.5 font-sans text-[11px] font-light tracking-wide text-charcoal/45">
              {complete ? `${value.city}, ${value.state} — ${value.pincode}` : 'Where should we courier your order?'}
            </span>
          </span>
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-charcoal/40 transition-transform group-hover:text-maroon" />
        ) : (
          <Plus className="h-4 w-4 text-charcoal/40 transition-colors group-hover:text-maroon" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="fields"
            initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.42, ease: EASE }, opacity: { duration: 0.28, ease: EASE } }}
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="mt-3 flex flex-col gap-4 rounded-2xl border border-charcoal/10 bg-ivory/60 px-6 py-6 md:px-7"
            >
              <motion.div variants={item}>
                <label className={label}>Full name</label>
                <input className={field} value={value.name} onChange={set('name')} placeholder="Priya Menon" autoComplete="name" />
              </motion.div>
              <motion.div variants={item}>
                <label className={label}>Phone number</label>
                <input className={field} value={value.phone} onChange={set('phone')} placeholder="+91 98470 00000" inputMode="tel" autoComplete="tel" />
              </motion.div>
              <motion.div variants={item}>
                <label className={label}>Delivery address</label>
                <textarea
                  className={`${field} min-h-[68px] rounded-[1.25rem] resize-none`}
                  value={value.address}
                  onChange={set('address')}
                  placeholder="House / flat, street, area"
                  autoComplete="street-address"
                  rows={2}
                />
              </motion.div>
              <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <label className={label}>City</label>
                  <input className={field} value={value.city} onChange={set('city')} placeholder="Kochi" autoComplete="address-level2" />
                </div>
                <div className="flex-1">
                  <label className={label}>State</label>
                  <input className={field} value={value.state} onChange={set('state')} placeholder="Kerala" autoComplete="address-level1" />
                </div>
              </motion.div>
              <motion.div variants={item} className="max-w-[180px]">
                <label className={label}>Pincode</label>
                <input className={field} value={value.pincode} onChange={set('pincode')} placeholder="682001" inputMode="numeric" autoComplete="postal-code" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
