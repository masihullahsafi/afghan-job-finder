
import React from 'react';
import { User } from '../types';
import { MapPin, Mail, Phone, Globe, Linkedin, CheckCircle } from 'lucide-react';

interface CVProps {
  user: User;
  theme: 'Modern' | 'Professional' | 'Creative' | 'Minimal';
}

export const CVTemplates: React.FC<CVProps> = ({ user, theme }) => {
  const ContactInfo = () => (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2"><Mail size={14} /> {user.email}</div>
      {user.phone && <div className="flex items-center gap-2"><Phone size={14} /> {user.phone}</div>}
      {user.address && <div className="flex items-center gap-2"><MapPin size={14} /> {user.address}</div>}
      {user.website && <div className="flex items-center gap-2"><Globe size={14} /> {user.website}</div>}
    </div>
  );

  const Skills = ({ className = "" }: { className?: string }) => (
    user.verifiedSkills && user.verifiedSkills.length > 0 ? (
      <div className={className}>
        <h3 className="font-bold uppercase tracking-wider mb-2 border-b pb-1">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {user.verifiedSkills.map((s, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{s}</span>
          ))}
        </div>
      </div>
    ) : null
  );

  const Experience = () => (
    <div className="mb-6">
      <h3 className="font-bold uppercase tracking-wider mb-4 border-b pb-1">Experience</h3>
      {user.experience && user.experience.length > 0 ? (
        user.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-lg">{exp.title}</h4>
              <span className="text-sm text-gray-500 font-medium">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="font-medium text-gray-700 mb-1">{exp.company}</p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 italic">No experience added.</p>
      )}
    </div>
  );

  const Education = () => (
    <div className="mb-6">
      <h3 className="font-bold uppercase tracking-wider mb-4 border-b pb-1">Education</h3>
      {user.education && user.education.length > 0 ? (
        user.education.map((edu) => (
          <div key={edu.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold">{edu.degree}</h4>
              <span className="text-sm text-gray-500 font-medium">{edu.startDate} - {edu.endDate}</span>
            </div>
            <p className="text-gray-700">{edu.school}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 italic">No education added.</p>
      )}
    </div>
  );

  // --- THEMES ---

  if (theme === 'Modern') {
    return (
      <div 
        className="w-full h-full bg-white flex flex-col md:flex-row shadow-lg max-w-[210mm] mx-auto min-h-[297mm] print:shadow-none print:max-w-full print:m-0"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        <div className="w-full md:w-1/3 bg-gray-900 text-white p-8">
          <div className="mb-8 text-center">
            {user.avatar ? (
              <img src={user.avatar} className="w-32 h-32 rounded-full mx-auto border-4 border-gray-700 object-cover mb-4" />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto border-4 border-gray-700 bg-gray-800 flex items-center justify-center text-4xl font-bold mb-4">{user.name[0]}</div>
            )}
            <h1 className="text-2xl font-bold uppercase tracking-wide">{user.name}</h1>
            <p className="text-gray-400 font-medium mt-1">{user.jobTitle}</p>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Contact</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3"><Mail size={16}/> {user.email}</div>
                {user.phone && <div className="flex items-center gap-3"><Phone size={16}/> {user.phone}</div>}
                {user.address && <div className="flex items-center gap-3"><MapPin size={16}/> {user.address}</div>}
              </div>
            </div>
            {user.verifiedSkills && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.verifiedSkills.map((s,i) => (
                    <span key={i} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-2/3 p-8 text-gray-800">
          <div className="mb-8">
            <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-900 pb-2 mb-4 text-gray-900">Profile</h3>
            <p className="text-sm leading-relaxed text-gray-600">{user.bio}</p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-900 pb-2 mb-4 text-gray-900">Experience</h3>
            {user.experience?.map(exp => (
              <div key={exp.id} className="mb-5 last:mb-0">
                <div className="flex justify-between font-bold text-gray-900">
                  <h4>{exp.title}</h4>
                  <span className="text-sm">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-gray-600 font-medium mb-1 text-sm">{exp.company}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-900 pb-2 mb-4 text-gray-900">Education</h3>
            {user.education?.map(edu => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between font-bold text-gray-900">
                  <h4>{edu.degree}</h4>
                  <span className="text-sm">{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className="text-gray-600 text-sm">{edu.school}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (theme === 'Creative') {
    return (
      <div 
        className="w-full h-full bg-white max-w-[210mm] mx-auto min-h-[297mm] relative overflow-hidden print:shadow-none print:max-w-full print:m-0"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        <div className="bg-purple-600 h-40 w-full absolute top-0 left-0"></div>
        <div className="relative px-12 pt-12">
          <div className="flex justify-between items-end mb-12">
            <div className="text-white">
              <h1 className="text-5xl font-extrabold mb-2">{user.name}</h1>
              <p className="text-xl opacity-90 font-medium">{user.jobTitle}</p>
            </div>
            <div className="bg-white p-1 rounded-full shadow-lg -mb-8">
               <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-32 h-32 rounded-full object-cover" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-12 mt-16">
            <div className="col-span-1 space-y-8">
               <div>
                 <h3 className="text-purple-600 font-bold uppercase tracking-widest text-sm mb-4">Contact</h3>
                 <div className="space-y-3 text-sm text-gray-600">
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                    <p>{user.address}</p>
                 </div>
               </div>
               {user.verifiedSkills && (
                 <div>
                   <h3 className="text-purple-600 font-bold uppercase tracking-widest text-sm mb-4">Skills</h3>
                   <div className="flex flex-wrap gap-2">
                     {user.verifiedSkills.map((s,i) => (
                       <span key={i} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold">{s}</span>
                     ))}
                   </div>
                 </div>
               )}
            </div>
            <div className="col-span-2 space-y-8">
               <div>
                 <h3 className="text-purple-600 font-bold uppercase tracking-widest text-sm mb-4">About Me</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">{user.bio}</p>
               </div>
               <div>
                 <h3 className="text-purple-600 font-bold uppercase tracking-widest text-sm mb-4">Experience</h3>
                 {user.experience?.map(exp => (
                   <div key={exp.id} className="mb-6 relative pl-6 border-l-2 border-purple-100 last:mb-0">
                     <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-purple-600"></div>
                     <h4 className="font-bold text-gray-900">{exp.title}</h4>
                     <p className="text-purple-600 text-sm font-medium mb-1">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                     <p className="text-gray-500 text-sm">{exp.description}</p>
                   </div>
                 ))}
               </div>
                <div>
                 <h3 className="text-purple-600 font-bold uppercase tracking-widest text-sm mb-4">Education</h3>
                 {user.education?.map(edu => (
                   <div key={edu.id} className="mb-4">
                     <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                     <p className="text-gray-500 text-sm">{edu.school} | {edu.startDate} - {edu.endDate}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (theme === 'Minimal') {
    return (
      <div 
        className="w-full h-full bg-white max-w-[210mm] mx-auto min-h-[297mm] p-12 text-gray-900 font-sans print:shadow-none print:max-w-full print:m-0"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        <div className="text-center mb-12 border-b pb-8">
          <h1 className="text-4xl font-light tracking-widest uppercase mb-2">{user.name}</h1>
          <p className="text-gray-500 tracking-wide uppercase text-sm mb-4">{user.jobTitle}</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span>{user.email}</span>
            <span>|</span>
            <span>{user.phone}</span>
            <span>|</span>
            <span>{user.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
           <div className="col-span-1 border-r pr-8 text-right">
              <div className="mb-8">
                <h3 className="font-bold uppercase text-sm mb-4">Skills</h3>
                <div className="flex flex-col gap-2 items-end">
                  {user.verifiedSkills?.map((s,i) => <span key={i} className="text-sm text-gray-600">{s}</span>)}
                </div>
              </div>
              <div>
                <h3 className="font-bold uppercase text-sm mb-4">Education</h3>
                {user.education?.map(edu => (
                  <div key={edu.id} className="mb-4">
                    <p className="font-bold text-sm">{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.school}</p>
                    <p className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
           </div>
           <div className="col-span-3">
              <div className="mb-10">
                <h3 className="font-bold uppercase text-sm mb-4 bg-gray-100 p-1 pl-2">Profile</h3>
                <p className="text-sm leading-relaxed text-gray-600">{user.bio}</p>
              </div>
              <div>
                <h3 className="font-bold uppercase text-sm mb-6 bg-gray-100 p-1 pl-2">Experience</h3>
                {user.experience?.map(exp => (
                  <div key={exp.id} className="mb-8">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-bold text-lg">{exp.title}</h4>
                      <span className="text-xs font-mono text-gray-500">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-700 mb-2">{exp.company}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Default: Professional
  return (
    <div 
        className="w-full h-full bg-white max-w-[210mm] mx-auto min-h-[297mm] p-12 text-gray-800 print:shadow-none print:max-w-full print:m-0"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <div className="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900">{user.name}</h1>
          <p className="text-xl text-gray-600 mt-2 font-medium">{user.jobTitle}</p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <p>{user.address}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 mb-3 pb-1">Professional Summary</h3>
        <p className="text-sm leading-relaxed text-gray-700">{user.bio}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 mb-4 pb-1">Experience</h3>
        {user.experience?.map(exp => (
          <div key={exp.id} className="mb-5">
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold text-gray-900 text-base">{exp.title}</h4>
              <span className="text-sm text-gray-500 font-medium italic">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-sm text-gray-700 font-semibold mb-1">{exp.company}</p>
            <p className="text-sm text-gray-600">{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 mb-4 pb-1">Education</h3>
          {user.education?.map(edu => (
            <div key={edu.id} className="mb-3">
              <h4 className="font-bold text-gray-900 text-sm">{edu.degree}</h4>
              <p className="text-sm text-gray-600">{edu.school}</p>
              <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 mb-4 pb-1">Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.verifiedSkills?.map((s,i) => (
              <span key={i} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
    