import React, { useState } from 'react';

import {
  Calendar,
  Clock,
  FileText,
  Image,
  Pencil,
  Plus,
  User,
  X,
} from 'lucide-react';

import { fetchAllServices } from '../../service/serviceService';
import { fetchAllSchedules } from '../../service/workOutCourse';
import { WorkoutCourse } from '../../type/workOutCourse';
import { Schedule } from '@/type/schedule';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (data: any) => void;
  trainers: { customerID: string, name: string, email?: string }[];
  initialData?: WorkoutCourse | null;
}

interface FormData {
  coursename: string;
  imageurl: string;
  personaltrainer: string;
  durationweek: string;
  description: string;
  schedules: string[];
  price: string;
  serviceid: string;
  startDate: Date;
  endDate: Date;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
  trainers,
  initialData
}) => {

const [formData, setFormData] = useState<FormData>({
  coursename: '',
  imageurl: '',
  personaltrainer: '',
  durationweek: '',
  description: '',
  schedules: [],
  price: '',
  serviceid: '',
  startDate: new Date(),
  endDate: new Date(),
});

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        coursename: initialData.coursename || '',
        imageurl: initialData.imageurl || '',
        personaltrainer: initialData.personaltrainerid || initialData.personaltrainername || '',
        durationweek: initialData.durationweek?.toString() || '',
        description: initialData.description || '',
        schedules: initialData.schedules as unknown as string[],
        price: initialData.price?.toString() || '',
        serviceid: initialData.serviceid || '',
        startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
        endDate: initialData.endDate ? new Date(initialData.endDate) : new Date(),
      });
    } else {
      setFormData({
        coursename: '',
        imageurl: '',
        personaltrainer: '',
        durationweek: '',
        description: '',
        schedules: [],
        price: '',
        serviceid: '',
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  }, [initialData, isOpen]);
  
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isOpen) {
      fetchAllSchedules().then(setAllSchedules).catch(() => setAllSchedules([]));
      fetchAllServices().then(setServices).catch(() => setServices([]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      let updated = { ...prev };
      if (name === 'startDate') {
        updated.startDate = new Date(value);
        updated.endDate = calcEndDate(new Date(value), prev.durationweek);
      } else if (name === 'durationweek') {
        updated.durationweek = value;
        updated.endDate = calcEndDate(prev.startDate, value);
      } else {
        updated[name] = value;
      }
      return updated;
    });
  };

// Hàm tính endDate dựa vào startDate và durationweek
function calcEndDate(startDate: Date, durationweek: string): Date {
  if (!startDate || !durationweek || isNaN(Number(durationweek))) return new Date();
  const start = new Date(startDate);
  start.setDate(start.getDate() + Number(durationweek) * 7);
  return start;
}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (initialData) {
        // Update: send all fields for update, matching add logic
        const selectedTrainer = trainers.find(t => t.customerID === formData.personaltrainer);
        const updatedCourse = {
          coursename: formData.coursename,
          imageurl: formData.imageurl,
          personaltrainer: formData.personaltrainer,
          durationweek: parseInt(formData.durationweek) || 0,
          description: formData.description,
          trainername: selectedTrainer?.name || '',   
          schedules: formData.schedules,
          price: parseFloat(formData.price) || 0,
          serviceid: formData.serviceid,
        };
        onAddCourse(updatedCourse);
        // Do not reset form after update
      } else {
        // Add: create full course object
        const selectedTrainer = trainers.find(t => t.customerID === formData.personaltrainer);
        const newCourse = {
          coursename: formData.coursename,
          imageurl: formData.imageurl,
          personaltrainer: formData.personaltrainer,
          durationweek: parseInt(formData.durationweek) || 0,
          description: formData.description,
          trainername: selectedTrainer?.name || '',
          schedules: formData.schedules,
          price: parseFloat(formData.price) || 0,
          serviceid: formData.serviceid, // add serviceid if present
          startDate: formData.startDate,
          endDate: formData.endDate,
        };
        onAddCourse(newCourse);
        // Reset form after adding
        setFormData({
          coursename: '',
          imageurl: '',
          personaltrainer: '',
          durationweek: '',
          description: '',
          schedules: [],
          price: '',
          serviceid: '',
          startDate: new Date(),
          endDate: new Date(),
        });
      }
      setErrors({});
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.coursename.trim()) {
      newErrors.coursename = 'Course name is required';
    }

    if (!formData.imageurl.trim()) {
      newErrors.imageurl = 'Image URL is required';
    } else if (!isValidUrl(formData.imageurl)) {
      newErrors.imageurl = 'Please enter a valid URL';
    }

    if (!formData.personaltrainer) {
      newErrors.personaltrainer = 'Please select a trainer';
    }

    if (Number(formData.durationweek) < 1 || Number(formData.durationweek) > 52) {
      newErrors.durationweek = 'Duration must be between 1 and 52 weeks';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };



  const handleClose = () => {
    setFormData({
      coursename: '',
      imageurl: '',
      personaltrainer: '',
      durationweek: 1,
      description: '',
      schedules: [],
      price: '',
      serviceid: '',
      startDate: '',
      endDate: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              {initialData ? (
                <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">Add New Course</h2>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Course Name
            </label>
            <input
              type="text"
              name="coursename"
              value={formData.coursename}
              onChange={handleInputChange}
              placeholder="Enter course name..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.coursename ? 'border-red-500' : 'border-gray-300'
                } ${initialData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
             
            />
            {errors.coursename && (
              <p className="text-red-500 text-sm mt-1">{errors.coursename}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4" />
              Image URL
            </label>
            <input
              type="url"
              name="imageurl"
              value={formData.imageurl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.imageurl ? 'border-red-500' : 'border-gray-300'
                } ${initialData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
           
            />
            {errors.imageurl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageurl}</p>
            )}
            {formData.imageurl && isValidUrl(formData.imageurl) && (
              <div className="mt-3">
                <img
                  src={formData.imageurl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Personal Trainer */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Personal Trainer
            </label>
            <select
              name="personaltrainer"
              value={formData.personaltrainer}
              onChange={handleInputChange}
              className={`text-black w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white ${errors.personaltrainer ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="" className='text-black'>Select a trainer...</option>
              {trainers.map(trainer => (
                <option key={trainer.customerID} value={trainer.customerID}>
                  {trainer.name} - {trainer.email}
                </option>
              ))}
            </select>
            {errors.personaltrainer && (
              <p className="text-red-500 text-sm mt-1">{errors.personaltrainer}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Duration (weeks)
            </label>
            <input
              type="number"
              name="durationweek"
              value={formData.durationweek}
              onChange={handleInputChange}
              min="1"
              max="52"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.durationweek ? 'border-red-500' : 'border-gray-300'
                } ${initialData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
             
            />
            {errors.durationweek && (
              <p className="text-red-500 text-sm mt-1">{errors.durationweek}</p>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá khóa học</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min={0}
              step={1000}
              placeholder="Nhập giá khóa học (VND)"
          
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the course objectives, target audience, and what participants will learn..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                } ${initialData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
             
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <p className="text-gray-500 text-sm ml-auto">
                {formData.description.length}/256 characters
              </p>
            </div>
          </div>

          {/* Start Date & End Date */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate instanceof Date ? formData.startDate.toISOString().slice(0,10) : ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                disabled={!!initialData}
              />
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate instanceof Date ? formData.endDate.toISOString().slice(0,10) : ''}
                readOnly
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Service Select */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Service
            </label>
            <select
              name="serviceid"
              value={formData.serviceid}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
        
            >
              <option value="">Select a service...</option>
              {services.map(service => (
                <option key={service.serviceID || service.serviceid} value={service.serviceID || service.serviceid}>
                  {service.serviceName || service.servicename}
                </option>
              ))}
            </select>
          </div>

          {/* Schedules Multi-Select */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Lịch trình (chọn nhiều)
            </label>
            <div className="border rounded-lg p-2 max-h-40 overflow-y-auto bg-white">
              {allSchedules.map(sch => {
                const id = sch.scheduleid;
                const label = `${sch.dayOfWeek} ${sch.startTime} - ${sch.endTime}`;
                return (
                  <label key={id} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      value={id}
                      checked={formData.schedules.includes(id)}
                   
                      onChange={e => {
                        const checked = e.target.checked;

                        setFormData(prev => ({
                          ...prev,
                          schedules: checked
                            ? [...prev.schedules, id]
                            : prev.schedules.filter(sid => sid !== id)
                        }));
                      }}
                      className="accent-purple-600"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
            {formData.schedules.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.schedules.map(sid => {
                  const sch = allSchedules.find(s => s.scheduleid === sid);
                  const label = sch ? `${sch.dayOfWeek} ${sch.startTime} - ${sch.endTime}` : sid;
                  return (
                    <span key={sid} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">{label}</span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {initialData ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {initialData ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};