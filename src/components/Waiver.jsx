'use client';
import { useEffect, useRef, useState } from 'react';

export default function WaiverModal({ open, onClose, onAccept, waiverText }) {
  const contentRef = useRef(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!open) {
      setChecked(false);
      setScrolledToBottom(false);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  }, [open]);

  const onScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    setScrolledToBottom(atBottom);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-black max-w-2xl w-full rounded-lg shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Waiver & Release</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-600">✕</button>
        </div>

        <div
          ref={contentRef}
          onScroll={onScroll}
          className="mb-4 border rounded p-4 h-64 overflow-auto text-sm leading-relaxed"
        >
          {waiverText ? (
            <div dangerouslySetInnerHTML={{ __html: waiverText }} />
          ) : (
             <>
              <p className="mb-3">
                I hereby acknowledge that I have voluntarily chosen to use the facilities and participate in the activities of Coney Power.
                The activities of Coney Power include but are not limited to Fitness Classes, Martial Arts Classes, Kickboxing, Brazilian Jiu-Jitsu,
                Wrestling, Seminars, Camps and Clinics, Boot Camps, Open Recreation, Personal Training, Weight Training and Conditioning (hereinafter called
                “activity” or “activities”).
              </p>

              <p className="mb-3">
                I understand the risks involved in the activities. I recognize that each activity involves risk of injury and I agree to accept any and all risks
                associated with it, including but not limited to property damage or loss, minor bodily injury, serious bodily injury or death. I further recognize
                that my participation in the activities may lead to minor or serious bodily injury to the head, arms, legs, neck and back; and injury to virtually all
                bones, joints, ligaments, muscles, tendons, and other aspects of the musculoskeletal system; injury to internal organs; and injury or impairment
                to other aspects of the body, general health and well being. I understand the danger and risk of participating in the activities may not only result
                in bodily injury, but also in impairment of future abilities to earn a living; engage in other business, social and recreational activities, and
                generally to enjoy life. I understand that participation in the activities involve risks incidental thereto, including but not limited to, travel to
                and from competitions, practices, classes; limited availability of immediate medical assistance; and the possible negligent or reckless conduct of
                other participants. I am voluntarily participating in the activities with the knowledge of the risks involved and hereby agree to accept any and all
                inherent risks of property damage, bodily injury, or death.
              </p>

              <h4 className="font-semibold mt-2 mb-1">Risks may include (but are not limited to):</h4>
              <ul className="list-disc pl-5 mb-3 space-y-1">
                <li><strong>Fitness Classes / Resistance Training / Personal Training:</strong> Overstraining, improper technique, improper use of equipment, equipment failures, failure to follow instruction, tripping or falling, overexertion, uncontrollable natural elements, horseplay.</li>
                <li><strong>Martial Arts / Kickboxing / BJJ / Wrestling:</strong> Physical contact with other participants, improper technique, equipment failure, failure to follow rules, contact with the floor or wall, horseplay.</li>
                <li>Failure to follow instruction or advice, improper use of equipment and errors in technique.</li>
              </ul>

              <p className="mb-3">
                I understand there are other risks not described above, not known to me now or not reasonably foreseen at this time that are associated with the activities.
                However, I acknowledge and accept those risks as well.
              </p>

              <p className="mb-3">
                In consideration of my participation in the activities, and to the fullest extent permitted by law, I agree to indemnify, defend and hold harmless
                Coney Power, its officers, managers, staff, members, directors, employees, attorneys, representatives, heirs, predecessors, successors,
                agents, affiliates, contractors, coaches, trainers, volunteers and assigns from and against all claims arising out of or resulting from my participation
                in the activities. “Claim” as used in this agreement means any financial loss, claim, suit, action, damage, or expense, including but not limited to
                attorney’s fees, attributable to bodily injury, sickness, disease or death, or injury to or destruction of tangible property including loss of use
                resulting therefrom.
              </p>

              <p className="mb-3">
                I also voluntarily hold harmless Coney Power and all listed parties for any claim arising out of or incident to my participation in any
                of the activities, whether the same is caused by or attributed to their negligence or otherwise.
              </p>

              <p className="mb-3">
                I understand Coney Power strongly recommends consulting with a physician prior to engaging in strenuous physical activity. I acknowledge
                that I am in good or reasonable physical condition to engage in strenuous physical activity. If my physical condition changes at any time, I will
                voluntarily withdraw from the activities.
              </p>

              <p className="mb-3">
                In the event that I should require medical treatment, I agree to be financially responsible for any costs incurred as a result of such treatment. I
                am aware and understand that I should carry my own health insurance. Furthermore, in the event that any damage to equipment or facilities occurs as a
                result of my or my family’s willful actions, neglect or recklessness, I acknowledge and agree to be held liable for any and all costs associated with
                such actions.
              </p>

              <p className="mb-3">
                I agree that this WAIVER AND RELEASE OF LIABILITY is effective for as long as I participate in the activities. I acknowledge that I have carefully read
                this WAIVER AND RELEASE OF LIABILITY and fully understand that it is a release of liability. I expressly agree to release and discharge Lions Martial
                Arts Center and all of its officers, managers, staff, members, directors, employees, attorneys, representatives, heirs, predecessors, successors,
                agents, affiliates, contractors, coaches, trainers, volunteers and assigns, from any and all claims or causes of action and I agree to voluntarily
                give up or waive any right that I otherwise have to bring a legal action against them for personal injury or property damage.
              </p>

              <p className="mb-0 text-xs text-gray-600">
                * Coney Power reserves the right to use photos/videos and likeness of all participants for promotional purposes.
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <input
            id="waiver-accept"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            disabled={!scrolledToBottom}
            className="w-4 h-4 accent-[#C5A572] focus:ring-0 "
          />
          <label htmlFor="waiver-accept" className={`text-sm ${!scrolledToBottom ? 'text-gray-400' : ''}`}>
            I have read and agree to the waiver terms.
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-black cursor-pointer rounded">Cancel</button>
          <button
            onClick={() => { if (checked) onAccept(); }}
            disabled={!checked}
            className={`px-4 py-2 rounded ${checked ? 'bg-[#C5A572] text-black hover:bg-[#b89c5e]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}