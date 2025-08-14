import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = '/';
  };

  // Yangi savol uchun form ma'lumotlari
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getQuestions();
      setQuestions(response.data);
    } catch (err) {
      setError('Error loading questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'correctAnswerIndex') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await adminAPI.updateQuestion(editingQuestion._id, formData);
      } else {
        await adminAPI.createQuestion(formData);
      }
      
      // Formni tozalash
      setFormData({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0
      });
      setEditingQuestion(null);
      setShowAddForm(false);
      loadQuestions();
    } catch (err) {
      setError('Error saving question');
      console.error(err);
    }
  };

  const handleEdit = (question) => {
    setFormData({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswerIndex: question.correctAnswerIndex
    });
    setEditingQuestion(question);
    setShowAddForm(true);
    
    // Edit form ga scroll qilish
    setTimeout(() => {
      const editForm = document.querySelector('.edit-form');
      if (editForm) {
        editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await adminAPI.deleteQuestion(questionId);
        loadQuestions();
      } catch (err) {
        setError('Error deleting question');
        console.error(err);
      }
    }
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
    setShowAddForm(false);
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div className="text-xl mt-4">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn"
          >
            Add New Question
          </button>
          <button
            onClick={handleLogout}
            className="btn-outline"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card mb-8 edit-form">
          <h2 className="text-xl font-semibold mb-4">
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Question Text:
              </label>
              <textarea
                name="questionText"
                value={formData.questionText}
                onChange={handleInputChange}
                className="form-textarea"
                rows="3"
                required
                placeholder="Enter your question..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Answer Options:
              </label>
              {formData.options.map((option, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="form-input"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">
                Correct Answer:
              </label>
              <select
                name="correctAnswerIndex"
                value={formData.correctAnswerIndex}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {formData.options.map((option, index) => (
                  <option key={index} value={index}>
                    Option {index + 1}: {option || `Option ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn">
                {editingQuestion ? 'Update Question' : 'Save Question'}
              </button>
              <button type="button" onClick={cancelEdit} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Questions List ({questions.length})</h2>
        
        {questions.length === 0 ? (
          <div className="text-center py-12 opacity-60">
            <p>No questions available yet.</p>
          </div>
        ) : (
          questions.map((question) => (
            <div key={question._id} className="admin-question-card">
              <div className="flex flex-between items-start mb-6">
                <div className="flex-1">
                  <div className="text-sm opacity-60 mb-2">
                    Question #{questions.indexOf(question) + 1}
                  </div>
                  <h3 className="text-xl font-semibold leading-relaxed mb-3">
                    {question.questionText}
                  </h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(question)}
                    className="action-btn edit-btn"
                    title="Edit Question"
                  >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(question._id)}
                    className="action-btn delete-btn"
                    title="Delete Question"
                  >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm font-medium opacity-80 mb-3">Answer Options:</div>
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 mb-3 rounded-lg border-2 transition-all ${
                      index === question.correctAnswerIndex
                        ? 'bg-green border-green'
                        : 'border-current border-opacity-20 hover:border-opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-current bg-opacity-10 flex items-center justify-center font-bold text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-base">{option}</span>
                      </div>
                      {index === question.correctAnswerIndex && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                          <span className="text-green font-medium text-sm">
                            Correct Answer
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-current border-opacity-10">
                <div className="text-sm opacity-60">
                  Created: {new Date(question.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-sm opacity-80">
                  ID: {question._id.slice(-6)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;