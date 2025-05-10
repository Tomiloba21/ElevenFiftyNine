import axios from 'axios';

import { API_ENDPOINTS, getAuthHeaders } from '../utility/apiConfig';


const DISCOUNTURL = `${API_ENDPOINTS.DISCOUNT}/`

class DiscountService {
  /**
   * Activate last hour deals with specified discount percentage
   * 
   * @param discountPercentage - Percentage discount to apply (1-100)
   * @returns Promise with the API response
   */
  activateLastHourDeals(discountPercentage: number) {
    return axios.post(
      `${DISCOUNTURL}activate?discountPercentage=${discountPercentage}`,
      {},
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Reset all product discounts
   * 
   * @returns Promise with the API response
   */
  resetAllDiscounts() {
    return axios.post(
      `${DISCOUNTURL}reset`,
      {},
      { headers: getAuthHeaders() }
    );
  }
}

export default new DiscountService();