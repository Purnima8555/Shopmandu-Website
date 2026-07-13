const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000";

/**
 * Submits the contact form to the backend.
 * @param {{name: string, email: string, phone: string, message: string}} formData
 * @returns {Promise<{success: boolean, data?: object, errors?: object}>}
 */
export async function submitContactForm(formData) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      result?.message || "Something went wrong. Please try again."
    );
    error.fieldErrors = result?.details;
    throw error;
  }

  return result;
}
