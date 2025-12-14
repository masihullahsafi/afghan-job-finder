
import React from 'react';
import { X, CheckCircle, XCircle, MapPin, DollarSign, Briefcase, Calendar } from 'lucide-react';
import { Job } from '../types';

interface JobCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  onRemoveJob: (jobId: string) => void;
}

export const JobCompareModal: React.FC<JobCompareModalProps> = ({ isOpen, onClose, jobs, onRemoveJob }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Job Comparison</h2>
            <p className="text-sm text-gray-500">Comparing {jobs.length} roles side-by-side</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[800px] p-6">
            <div className="grid grid-cols-4 gap-4">
              
              {/* Labels Column */}
              <div className="col-span-1 space-y-6 pt-24 font-bold text-gray-500 text-sm">
                <div className="h-10 flex items-center">Salary Range</div>
                <div className="h-10 flex items-center">Location</div>
                <div className="h-10 flex items-center">Job Type</div>
                <div className="h-10 flex items-center">Experience</div>
                <div className="h-10 flex items-center">Posted Date</div>
                <div className="h-20 flex items-center">Requirements</div>
                <div className="h-20 flex items-center">Description</div>
              </div>

              {/* Jobs Columns */}
              {jobs.map(job => (
                <div key={job.id} className="col-span-1 space-y-6 relative border-l border-gray-100 pl-4">
                  <button 
                    onClick={() => onRemoveJob(job.id)} 
                    className="absolute top-0 right-0 text-red-400 hover:text-red-600 p-1"
                    title="Remove"
                  >
                    <XCircle size={18}/>
                  </button>
                  
                  {/* Header */}
                  <div className="h-24">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-1" title={job.title}>{job.title}</h3>
                    <p className="text-primary-600 text-sm font-medium mb-2">{job.company}</p>
                    <img src={job.companyLogo} className="w-8 h-8 rounded object-cover bg-gray-100" />
                  </div>

                  {/* Data Rows */}
                  <div className="h-10 flex items-center text-sm font-medium text-gray-900">
                    <DollarSign size={14} className="text-green-600 mr-1"/> 
                    {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                  </div>
                  <div className="h-10 flex items-center text-sm text-gray-700">
                    <MapPin size={14} className="text-gray-400 mr-1"/> {job.location}
                  </div>
                  <div className="h-10 flex items-center text-sm text-gray-700">
                    <Briefcase size={14} className="text-gray-400 mr-1"/> {job.type}
                  </div>
                  <div className="h-10 flex items-center text-sm text-gray-700">
                    {job.experienceLevel}
                  </div>
                  <div className="h-10 flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="text-gray-400 mr-1"/> {job.postedDate}
                  </div>
                  <div className="h-20 overflow-y-auto text-xs text-gray-600 space-y-1">
                    {job.requirements.slice(0,3).map(r => (
                        <div key={r} className="flex gap-1"><CheckCircle size={10} className="text-green-500 mt-0.5 flex-shrink-0"/> {r}</div>
                    ))}
                  </div>
                  <div className="h-20 overflow-y-auto text-xs text-gray-500 leading-relaxed">
                    {job.description}
                  </div>
                  
                  {/* Action */}
                  <div className="pt-4">
                    <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-primary-700">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty Slots */}
              {[...Array(3 - jobs.length)].map((_, i) => (
                <div key={i} className="col-span-1 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50/50">
                  <span className="text-gray-400 text-sm">Select a job to compare</span>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
