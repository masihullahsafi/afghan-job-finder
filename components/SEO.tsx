
import React, { useEffect } from 'react';
import { Job } from '../types';

interface SEOProps {
  title: string;
  description?: string;
  jobData?: Job;
}

export const SEO: React.FC<SEOProps> = ({ title, description, jobData }) => {
  useEffect(() => {
    // Basic Meta
    document.title = `${title} | Afghan Job Finder`;
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // Structured Data for Google Jobs
    if (jobData) {
      // Fixed: Changed jobData.id to jobData._id
      const scriptId = `job-jsonld-${jobData._id}`;
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      const jobSchema = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": jobData.title,
        "description": jobData.description,
        "identifier": {
          "@type": "PropertyValue",
          "name": jobData.company,
          // Fixed: Changed jobData.id to jobData._id
          "value": jobData._id
        },
        "datePosted": jobData.postedDate,
        "validThrough": jobData.deadline,
        "employmentType": jobData.type === 'Full-time' ? 'FULL_TIME' : jobData.type === 'Part-time' ? 'PART_TIME' : 'CONTRACTOR',
        "hiringOrganization": {
          "@type": "Organization",
          "name": jobData.company,
          "sameAs": "https://afghanjobfinder.com",
          "logo": jobData.companyLogo
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": jobData.location,
            "addressCountry": "AF"
          }
        },
        "baseSalary": {
          "@type": "MonetaryAmount",
          "currency": jobData.currency,
          "value": {
            "@type": "QuantitativeValue",
            "minValue": jobData.salaryMin,
            "maxValue": jobData.salaryMax,
            "unitText": "MONTH"
          }
        }
      };

      script.text = JSON.stringify(jobSchema);
    }

    return () => {
      if (jobData) {
        // Fixed: Changed jobData.id to jobData._id
        const script = document.getElementById(`job-jsonld-${jobData._id}`);
        if (script) script.remove();
      }
    };
  }, [title, description, jobData]);

  return null;
};
