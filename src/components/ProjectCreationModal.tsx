import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment-timezone';

interface ProjectCreationModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

interface FormData {
  projectName: string;
  location: string;
  timezone: string;
  description: string;
  dataSource: 'self-hosted' | 'imported' | '';
  databaseType: 'mysql' | 'google-sheet' | '';
  mysqlConfig: {
    displayName: string;
    host: string;
    port: string;
    username: string;
    password: string;
    databaseName: string;
  };
  googleSheetConfig: {
    dataSource: string;
    displayName: string;
    spreadsheetLink: string;
  };
  organization: {
    name: string;
    members: Array<{
      name: string;
      role: 'admin' | 'editor' | 'viewer';
      email: string;
    }>;
  };
}

interface ValidationErrors {
  step1: string[];
  step2: string[];
  step3: string[];
  step4: string[];
}

const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({
    step1: [],
    step2: [],
    step3: [],
    step4: [],
  });
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    location: '',
    timezone: moment.tz.guess(),
    description: '',
    dataSource: '',
    databaseType: '',
    mysqlConfig: {
      displayName: '',
      host: '',
      port: '3306',
      username: '',
      password: '',
      databaseName: '',
    },
    googleSheetConfig: {
      dataSource: '',
      displayName: '',
      spreadsheetLink: '',
    },
    organization: {
      name: '',
      members: [{ name: '', role: 'viewer', email: '' }],
    },
  });

  const validateStep1 = () => {
    const newErrors: string[] = [];
    if (!formData.projectName.trim()) {
      newErrors.push('Project name is required');
    }
    if (!formData.location.trim()) {
      newErrors.push('Location is required');
    }
    if (!formData.timezone) {
      newErrors.push('Timezone is required');
    }
    setErrors((prev) => ({ ...prev, step1: newErrors }));
    return newErrors.length === 0;
  };

  const validateStep2 = () => {
    const newErrors: string[] = [];
    if (!formData.dataSource) {
      newErrors.push('Please select a data source');
    }
    setErrors((prev) => ({ ...prev, step2: newErrors }));
    return newErrors.length === 0;
  };

  const validateStep3 = () => {
    const newErrors: string[] = [];
    if (formData.dataSource === 'self-hosted') {
      const { displayName, host, port, databaseName } = formData.mysqlConfig;
      if (!displayName.trim()) newErrors.push('Display name is required');
      if (!host.trim()) newErrors.push('Host is required');
      if (!port.trim()) newErrors.push('Port is required');
      if (!databaseName.trim()) newErrors.push('Database name is required');
    } else {
      const { dataSource, displayName, spreadsheetLink } =
        formData.googleSheetConfig;
      if (!dataSource.trim()) newErrors.push('Data source is required');
      if (!displayName.trim()) newErrors.push('Display name is required');
      if (!spreadsheetLink.trim())
        newErrors.push('Spreadsheet link is required');
    }
    setErrors((prev) => ({ ...prev, step3: newErrors }));
    return newErrors.length === 0;
  };

  const validateStep4 = () => {
    const newErrors: string[] = [];
    if (!formData.organization.name.trim()) {
      newErrors.push('Organization name is required');
    }
    formData.organization.members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors.push(`Member ${index + 1} name is required`);
      }
      if (!member.email.trim()) {
        newErrors.push(`Member ${index + 1} email is required`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        newErrors.push(`Member ${index + 1} email is invalid`);
      }
    });
    setErrors((prev) => ({ ...prev, step4: newErrors }));
    return newErrors.length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setErrors((prev) => ({ ...prev, [`step${currentStep}`]: [] }));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors((prev) => ({ ...prev, [`step${currentStep}`]: [] }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 4) {
      if (validateStep4()) {
        onSubmit(formData);
      }
    }
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      organization: {
        ...formData.organization,
        members: [
          ...formData.organization.members,
          { name: '', role: 'viewer', email: '' },
        ],
      },
    });
  };

  const removeTeamMember = (index: number) => {
    const newMembers = formData.organization.members.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      organization: {
        ...formData.organization,
        members: newMembers,
      },
    });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newMembers = [...formData.organization.members];
    newMembers[index] = { ...newMembers[index], [field]: value as any };
    setFormData({
      ...formData,
      organization: {
        ...formData.organization,
        members: newMembers,
      },
    });
  };

  const renderErrors = (step: keyof ValidationErrors) => {
    if (errors[step].length === 0) return null;
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
        {errors[step].map((error, index) => (
          <div key={index} className="text-red-600 text-sm">
            • {error}
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name*
        </label>
        <input
          type="text"
          value={formData.projectName}
          onChange={(e) =>
            setFormData({ ...formData, projectName: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Location*
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone*
        </label>
        <select
          value={formData.timezone}
          onChange={(e) =>
            setFormData({ ...formData, timezone: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {moment.tz.names().map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {renderErrors('step1')}
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Data Source*
        </label>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="self-hosted"
              checked={formData.dataSource === 'self-hosted'}
              onChange={() =>
                setFormData({
                  ...formData,
                  dataSource: 'self-hosted' as const,
                  databaseType: 'mysql',
                })
              }
              className="h-4 w-4 text-blue-600"
            />
            <span>Self-hosted Data</span>
          </label>
          <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="imported"
              checked={formData.dataSource === 'imported'}
              onChange={() =>
                setFormData({
                  ...formData,
                  dataSource: 'imported' as const,
                  databaseType: 'google-sheet',
                })
              }
              className="h-4 w-4 text-blue-600"
            />
            <span>Imported Data</span>
          </label>
        </div>
      </div>
      {renderErrors('step2')}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {formData.dataSource === 'self-hosted' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name*
            </label>
            <input
              type="text"
              value={formData.mysqlConfig.displayName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mysqlConfig: {
                    ...formData.mysqlConfig,
                    displayName: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Host*
            </label>
            <input
              type="text"
              value={formData.mysqlConfig.host}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mysqlConfig: {
                    ...formData.mysqlConfig,
                    host: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Port*
              </label>
              <input
                type="text"
                value={formData.mysqlConfig.port}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mysqlConfig: {
                      ...formData.mysqlConfig,
                      port: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Name*
              </label>
              <input
                type="text"
                value={formData.mysqlConfig.databaseName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mysqlConfig: {
                      ...formData.mysqlConfig,
                      databaseName: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Source*
            </label>
            <input
              type="text"
              value={formData.googleSheetConfig.dataSource}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  googleSheetConfig: {
                    ...formData.googleSheetConfig,
                    dataSource: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name*
            </label>
            <input
              type="text"
              value={formData.googleSheetConfig.displayName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  googleSheetConfig: {
                    ...formData.googleSheetConfig,
                    displayName: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spreadsheet Link*
            </label>
            <input
              type="text"
              value={formData.googleSheetConfig.spreadsheetLink}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  googleSheetConfig: {
                    ...formData.googleSheetConfig,
                    spreadsheetLink: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}
      {renderErrors('step3')}
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization Name*
        </label>
        <input
          type="text"
          value={formData.organization.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              organization: { ...formData.organization, name: e.target.value },
            })
          }
          placeholder="Enter organization name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Team Members*
          </label>
          <button
            type="button"
            onClick={addTeamMember}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Member
          </button>
        </div>

        <div className="space-y-3">
          {formData.organization.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex-1 grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) =>
                    updateTeamMember(index, 'name', e.target.value)
                  }
                  placeholder="Name*"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) =>
                    updateTeamMember(index, 'email', e.target.value)
                  }
                  placeholder="Email*"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={member.role}
                  onChange={(e) =>
                    updateTeamMember(index, 'role', e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              {formData.organization.members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTeamMember(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      {renderErrors('step4')}
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 140px)' }}
        >
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-24 h-1 ${
                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleFormSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              )}

              <button
                type={currentStep === 4 ? 'submit' : 'button'}
                onClick={currentStep < 4 ? handleNext : undefined}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentStep < 4 ? (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectCreationModal;
