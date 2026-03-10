import { createSlice } from "@reduxjs/toolkit";
import type { CompanyId } from "@/lib/companies/config";

export interface CompanyState {
  selectedCompanyId: CompanyId;
}

const initialState: CompanyState = {
  selectedCompanyId: "kmb",
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSelectedCompanyId: (state, action: { payload: CompanyId }) => {
      state.selectedCompanyId = action.payload;
    },
  },
});

export const { setSelectedCompanyId } = companySlice.actions;

