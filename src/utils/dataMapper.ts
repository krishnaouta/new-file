/* eslint-disable @typescript-eslint/no-explicit-any */
export interface InternalField {
    key: string;
    label: string;
    type?: string;
    required?: boolean;
}

export const internalFields: InternalField[] = [
    { key: 'ServicerName', label: 'ServicerName', type: 'String' },
    { key: 'InvestorCode', label: 'InvestorCode', type: 'LIST' },
    { key: 'LoanNumber', label: 'LoanNumber', type: 'String' },
    { key: 'InvestorLoanIdentifier', label: 'InvestorLoanIdentifier', type: 'String' },
    { key: 'PLS_ID', label: 'PLS_ID', type: 'String' },
    { key: 'PrincipalandInterestPaymentAmount', label: 'PrincipalandInterestPaymentAmount', type: 'Currency' },
    { key: 'EscrowsWaivedIndicator', label: 'EscrowsWaivedIndicator', type: 'Boolean' },
    { key: 'LoanAmortizationTypeCode', label: 'LoanAmortizationTypeCode', type: 'LIST' },
    { key: 'PropertyTypeCode', label: 'PropertyTypeCode', type: 'LIST' },
    { key: 'CapitalizedTotalAmount', label: 'CapitalizedTotalAmount', type: 'Currency' },
    { key: 'PropertyOccupancyStatusCode', label: 'PropertyOccupancyStatusCode', type: 'LIST' },
    { key: 'UnpaidPrincipalBalanceAmount', label: 'UnpaidPrincipalBalanceAmount', type: 'Currency' },
    { key: 'Mod_Lien_Original_Loan_Bal', label: 'Mod_Lien_Original_Loan_Bal', type: 'Currency' },
    { key: 'EscrowPaymentAmount', label: 'EscrowPaymentAmount', type: 'Currency' },
    { key: 'CurrentLastPaidInstallmentDate', label: 'CurrentLastPaidInstallmentDate', type: 'Date' },
    { key: 'LoanRemainingTerm', label: 'LoanRemainingTerm', type: 'Numeric' },
    { key: 'ExistingForbearanceAmount', label: 'ExistingForbearanceAmount', type: 'Currency' },
    { key: 'CapitalizedFees', label: 'CapitalizedFees', type: 'Currency' },
    { key: 'GrossMonthlyIncome', label: 'GrossMonthlyIncome', type: 'Currency' },
    { key: 'CurrentInterestRate', label: 'CurrentInterestRate', type: 'Numeric' },
    { key: 'LoanEscrowAdvanceAmount', label: 'LoanEscrowAdvanceAmount', type: 'Currency' },
    { key: 'ForeclosureStatusCode', label: 'ForeclosureStatusCode', type: 'LIST' },
    { key: 'LoanRunType', label: 'LoanRunType', type: 'LIST' },
    { key: 'LoanInForeclosureIndicator', label: 'LoanInForeclosureIndicator', type: 'Boolean' },
    { key: 'HardshipDurationTypeCode', label: 'HardshipDurationTypeCode', type: 'LIST' },
    { key: 'MonthlyHousingExpense', label: 'MonthlyHousingExpense', type: 'Currency' },
    { key: 'MortgageInsuranceIndicator', label: 'MortgageInsuranceIndicator', type: 'Boolean' },
    { key: 'LoanPriorModificationIndicator', label: 'LoanPriorModificationIndicator', type: 'Boolean' },
    { key: 'HardshipReasonCode1', label: 'HardshipReasonCode1', type: 'LIST' },
    { key: 'EscrowedHazardInsuranceIndicator', label: 'EscrowedHazardInsuranceIndicator', type: 'Boolean' },
    { key: 'EscrowedPropertyTaxIndicator', label: 'EscrowedPropertyTaxIndicator', type: 'Boolean' },
    { key: 'LoanImminentDefaultIndicator', label: 'LoanImminentDefaultIndicator', type: 'Boolean' },
    { key: 'MonthlyHazardInsuranceAmount', label: 'MonthlyHazardInsuranceAmount', type: 'Currency' },
    { key: 'MonthlyMortgageInsuranceAmount', label: 'MonthlyMortgageInsuranceAmount', type: 'Currency' },
    { key: 'MonthlyRealEstateTaxAmount', label: 'MonthlyRealEstateTaxAmount', type: 'Currency' },
    { key: 'AmortizationTermatOrigination', label: 'AmortizationTermatOrigination', type: 'Numeric' },
    { key: 'LienTypeCode', label: 'LienTypeCode', type: 'LIST' },
    { key: 'LoanOriginalMaturityDate', label: 'LoanOriginalMaturityDate', type: 'Date' },
    { key: 'PropertyConditionCode', label: 'PropertyConditionCode', type: 'LIST' },
    { key: 'PropertyValuationAmount', label: 'PropertyValuationAmount', type: 'Currency' },
    { key: 'PropertyValuationDate', label: 'PropertyValuationDate', type: 'Date' },
    { key: 'MonthlyHOAAmount', label: 'MonthlyHOAAmount', type: 'Currency' },
    { key: 'FutureEscrowShortagePaymentAmount', label: 'FutureEscrowShortagePaymentAmount', type: 'Currency' },
    { key: 'MonthlyFloodInsuranceAmount', label: 'MonthlyFloodInsuranceAmount', type: 'Currency' },
    { key: 'EscrowedFloodInsuranceIndicator', label: 'EscrowedFloodInsuranceIndicator', type: 'Boolean' },
    { key: 'MonthlyExpenseAmount', label: 'MonthlyExpenseAmount', type: 'Currency' },
    { key: 'PriorWorkoutTypeCode1', label: 'PriorWorkoutTypeCode1', type: 'LIST' },
    { key: 'PriorWorkoutStatusTypeCode1', label: 'PriorWorkoutStatusTypeCode1', type: 'LIST' },
    { key: 'LateCharges', label: 'LateCharges', type: 'Currency' },
    { key: 'Borrower1_FirstName', label: 'Borrower1_FirstName', type: 'String' },
    { key: 'Borrower1_LastName', label: 'Borrower1_LastName', type: 'String' },
    { key: 'PropertyAddress', label: 'PropertyAddress', type: 'String' },
    { key: 'NetMonthlyIncome', label: 'NetMonthlyIncome', type: 'Currency' },
    { key: 'PropertyCity', label: 'PropertyCity', type: 'String' },
    { key: 'VerifiedHardshipIndicator', label: 'VerifiedHardshipIndicator', type: 'Boolean' },
    { key: 'CreditReportIndicator', label: 'CreditReportIndicator', type: 'Boolean' },
    { key: 'PropertyCounty', label: 'PropertyCounty', type: 'LIST' },
    { key: 'PropertyStateCode', label: 'PropertyStateCode', type: 'LIST' },
    { key: 'PropertyZip', label: 'PropertyZip', type: 'String' },
    { key: 'CreditLiabilityAmount', label: 'CreditLiabilityAmount', type: 'Currency' },
    { key: 'TrialInterestRate', label: 'TrialInterestRate', type: 'Numeric' },
    { key: 'BorrowerContributionAmount', label: 'BorrowerContributionAmount', type: 'Currency' },
    { key: 'SuspenseBalanceAmount', label: 'SuspenseBalanceAmount', type: 'Currency' },
    { key: 'CurrentEscrowShortagePaymentAmount', label: 'CurrentEscrowShortagePaymentAmount', type: 'Currency' },
    { key: 'VerifiedStableIncomeIndicator', label: 'VerifiedStableIncomeIndicator', type: 'Boolean' },
    { key: 'DisasterDeclaredDate', label: 'DisasterDeclaredDate', type: 'Date' },
    { key: 'PriorWorkoutCompletedDate1', label: 'PriorWorkoutCompletedDate1', type: 'Date' },
    { key: 'ResumeMonthlyPaymentsEvidenceIndicator', label: 'ResumeMonthlyPaymentsEvidenceIndicator', type: 'Boolean' },
    { key: 'TotalEscrowShortagePaymentAmount', label: 'TotalEscrowShortagePaymentAmount', type: 'Currency' },
    { key: 'AccumulatedLateFeesWaivedIndicator', label: 'AccumulatedLateFeesWaivedIndicator', type: 'Boolean' },
    { key: 'HardshipDocumentReceivedIndicator', label: 'HardshipDocumentReceivedIndicator', type: 'Boolean' },
    { key: 'EscrowedAssociationDuesIndicator', label: 'EscrowedAssociationDuesIndicator', type: 'Boolean' },
    { key: 'EscrowShortageRepayMonths', label: 'EscrowShortageRepayMonths', type: 'Int' },
    { key: 'DateofOriginalNote', label: 'DateofOriginalNote', type: 'Date' },
    { key: 'PropertyNumberofUnits', label: 'PropertyNumberofUnits', type: 'Numeric' },
    { key: 'PropertyUsageTypeCode', label: 'PropertyUsageTypeCode', type: 'LIST' },
    { key: 'UPBofExistingPartialClaim', label: 'UPBofExistingPartialClaim', type: 'Currency' },
    { key: 'FutureMonthlyRealEstateTaxAmount', label: 'FutureMonthlyRealEstateTaxAmount', type: 'Currency' },
    { key: 'FutureMonthlyHOAAmount', label: 'FutureMonthlyHOAAmount', type: 'Currency' },
    { key: 'FutureMonthlyMortgageInsuranceAmount', label: 'FutureMonthlyMortgageInsuranceAmount', type: 'Currency' },
    { key: 'FutureMonthlyHazardInsuranceAmount', label: 'FutureMonthlyHazardInsuranceAmount', type: 'Currency' },
    { key: 'FutureMonthlyFloodInsuranceAmount', label: 'FutureMonthlyFloodInsuranceAmount', type: 'Currency' },
    { key: 'ModifiedMortgagePaymentBorrowerConsentIndicator', label: 'ModifiedMortgagePaymentBorrowerConsentIndicator', type: 'Boolean' },
    { key: 'BorrowerHardshipStatusCode', label: 'BorrowerHardshipStatusCode', type: 'LIST' },
    { key: 'ForbearancePaymentAffordabilityIndicator', label: 'ForbearancePaymentAffordabilityIndicator', type: 'Boolean' },
    { key: 'RePayDebtWithinSixMonthsIndicator', label: 'RePayDebtWithinSixMonthsIndicator', type: 'Boolean' },
    { key: 'LoanPreviousModDate', label: 'LoanPreviousModDate', type: 'Date' },
    { key: 'PriorWorkoutActivityTypeCode1', label: 'PriorWorkoutActivityTypeCode1', type: 'LIST' },
    { key: 'PriorWorkoutFailOrCancelReasonTypeCode1', label: 'PriorWorkoutFailOrCancelReasonTypeCode1', type: 'LIST' },
    { key: 'PriorWorkoutStatusDate1', label: 'PriorWorkoutStatusDate1', type: 'Date' },
    { key: 'OtherAdvancesForCapitalization', label: 'OtherAdvancesForCapitalization', type: 'Currency' },
    { key: 'CapitalizedInterestAmount', label: 'CapitalizedInterestAmount', type: 'Currency' },
    { key: 'FirstPermPaymentDueDate', label: 'FirstPermPaymentDueDate', type: 'Date' },
    { key: 'FirstTrialPaymentDueDate', label: 'FirstTrialPaymentDueDate', type: 'Date' },
    { key: 'LoanMortgageTypeCode', label: 'LoanMortgageTypeCode', type: 'LIST' },
    { key: 'CoBorrowerIndicator', label: 'CoBorrowerIndicator', type: 'Boolean' },
    { key: 'AdditionalCoBorrower1Indicator', label: 'AdditionalCoBorrower1Indicator', type: 'Boolean' },
    { key: 'AdditionalCoBorrower2Indicator', label: 'AdditionalCoBorrower2Indicator', type: 'Boolean' },
    { key: 'AdditionalCoBorrower3Indicator', label: 'AdditionalCoBorrower3Indicator', type: 'Boolean' },
    { key: 'NonBorrowerIndicator', label: 'NonBorrowerIndicator', type: 'Boolean' },
    { key: 'PCEscrowOverage', label: 'PCEscrowOverage', type: 'Currency' },
    { key: 'NumberofPreviousMod', label: 'NumberofPreviousMod', type: 'Int' },
    { key: 'BankruptcyType1', label: 'BankruptcyType1', type: 'LIST' },
    { key: 'BankruptcyStatusType1', label: 'BankruptcyStatusType1', type: 'LIST' },
    { key: 'BorrowerCurrentLegalOwnerIndicator', label: 'BorrowerCurrentLegalOwnerIndicator', type: 'Boolean' },
    { key: 'LoanCurrentOrLessThan30DaysPastDueFromDisasterDeclaredIndicator', label: 'LoanCurrentOrLessThan30DaysPastDueFromDisasterDeclaredIndicator', type: 'Boolean' },
    { key: 'InvestorApprovalIndicator', label: 'InvestorApprovalIndicator', type: 'Boolean' },
    { key: 'FirstPaymentDateatOrigination', label: 'FirstPaymentDateatOrigination', type: 'Date' },
    { key: 'TrialPeriod', label: 'TrialPeriod', type: 'Int' },
    { key: 'DelinquencyUnresolved12MonthIndicator', label: 'DelinquencyUnresolved12MonthIndicator', type: 'Boolean' },
    { key: 'TheborrowerNoGreaterthan120dayspastDue', label: 'TheborrowerNoGreaterthan120dayspastDue', type: 'Boolean' },
    { key: 'InitialForbearanceRequest', label: 'InitialForbearanceRequest', type: 'Boolean' },
    { key: 'LastApprovedPSAWithin36MonthsIndicator', label: 'LastApprovedPSAWithin36MonthsIndicator', type: 'Boolean' },
    { key: 'ServicerLoanIdentifier', label: 'ServicerLoanIdentifier', type: 'Numeric' },
    { key: 'FannieMaeServicerIdentifier', label: 'FannieMaeServicerIdentifier', type: 'Numeric' },
    { key: 'WorkoutTypeCode', label: 'WorkoutTypeCode', type: 'List' },
    { key: 'UseAssociatedTrialIndicator', label: 'UseAssociatedTrialIndicator', type: 'Boolean' },
    { key: 'CampaignTrialPeriodLength', label: 'CampaignTrialPeriodLength', type: 'Numeric' },
    { key: 'RequestID', label: 'RequestID', type: 'String' },
    { key: 'Borrower2_FirstName', label: 'Borrower2_FirstName', type: 'String' },
    { key: 'Borrower2_LastName', label: 'Borrower2_LastName', type: 'String' },
    { key: 'Borrower3_FirstName', label: 'Borrower3_FirstName', type: 'String' },
    { key: 'Borrower3_LastName', label: 'Borrower3_LastName', type: 'String' },
    { key: 'Borrower4_FirstName', label: 'Borrower4_FirstName', type: 'String' },
    { key: 'Borrower4_LastName', label: 'Borrower4_LastName', type: 'String' },
    { key: 'Borrower5_FirstName', label: 'Borrower5_FirstName', type: 'String' },
    { key: 'Borrower5_LastName', label: 'Borrower5_LastName', type: 'String' },
    { key: 'Borrower6_FirstName', label: 'Borrower6_FirstName', type: 'String' },
    { key: 'Borrower6_LastName', label: 'Borrower6_LastName', type: 'String' },
    { key: 'Borrower1CreditScore', label: 'Borrower1CreditScore', type: 'Numeric' },
    { key: 'Borrower2CreditScore', label: 'Borrower2CreditScore', type: 'Numeric' },
    { key: 'Borrower3CreditScore', label: 'Borrower3CreditScore', type: 'Numeric' },
    { key: 'Borrower4CreditScore', label: 'Borrower4CreditScore', type: 'Numeric' },
    { key: 'Borrower5CreditScore', label: 'Borrower5CreditScore', type: 'Numeric' },
    { key: 'Borrower6CreditScore', label: 'Borrower6CreditScore', type: 'Numeric' },
    { key: 'PropertyAddressStreetLine2', label: 'PropertyAddressStreetLine2', type: 'String' },
    { key: 'NextARMResetRate', label: 'NextARMResetRate', type: 'Numeric' },
    { key: 'NextARMResetDate', label: 'NextARMResetDate', type: 'Date' },
    { key: 'LifetimeInterestRateCapForARMLoans', label: 'LifetimeInterestRateCapForARMLoans', type: 'Numeric' },
    { key: 'FinalInterestRateForStepRateLoans', label: 'FinalInterestRateForStepRateLoans', type: 'Numeric' },
    { key: 'ValuationTypeCode', label: 'ValuationTypeCode', type: 'LIST' },
    { key: 'InterestRateatOrigination', label: 'InterestRateatOrigination', type: 'Numeric' },
    { key: 'OriginalNoteAmount', label: 'OriginalNoteAmount', type: 'Currency' },
    { key: 'LoanEscrowShortagePaybackDurationMonthCount', label: 'LoanEscrowShortagePaybackDurationMonthCount', type: 'Numeric' },
    { key: 'EscrowProhibitedByLawIndicator', label: 'EscrowProhibitedByLawIndicator', type: 'Boolean' },
    { key: 'ForgivenInterestAmount', label: 'ForgivenInterestAmount', type: 'Currency' },
    { key: 'AttorneyCosts', label: 'AttorneyCosts', type: 'Currency' },
    { key: 'LoanCurrentEscrowAdvanceAmount', label: 'LoanCurrentEscrowAdvanceAmount', type: 'Currency' },
    { key: 'HardshipReasonCode2', label: 'HardshipReasonCode2', type: 'LIST' },
    { key: 'HardshipReasonCode3', label: 'HardshipReasonCode3', type: 'LIST' },
    { key: 'MICompanyName', label: 'MICompanyName', type: 'String' },
    { key: 'InsuranceCoveragePercent', label: 'InsuranceCoveragePercent', type: 'Numeric' },
    { key: 'MIPartialClaimAmount', label: 'MIPartialClaimAmount', type: 'Currency' },
    { key: 'MortgageInsuranceContactName', label: 'MortgageInsuranceContactName', type: 'String' },
    { key: 'MortgageInsuranceRequiredBorrowerContributionAmount', label: 'MortgageInsuranceRequiredBorrowerContributionAmount', type: 'Currency' },
    { key: 'MortgageInsuranceDecision', label: 'MortgageInsuranceDecision', type: 'Boolean' },
    { key: 'MortgageInsuranceContactPhoneNumber', label: 'MortgageInsuranceContactPhoneNumber', type: 'Numeric' },
    { key: 'MICertificateNumber', label: 'MICertificateNumber', type: 'String' },
    { key: 'MIDecisionComment', label: 'MIDecisionComment', type: 'String' },
    { key: 'MBSPoolIssueDate', label: 'MBSPoolIssueDate', type: 'Date' },
    { key: 'PMMSRateLockDate', label: 'PMMSRateLockDate', type: 'Date' },
    { key: 'DataCollectionDate', label: 'DataCollectionDate', type: 'Date' },
    { key: 'DiscountRateRiskPremium', label: 'DiscountRateRiskPremium', type: 'Numeric' },
    { key: 'PrincipalPaymentAmount1', label: 'PrincipalPaymentAmount1', type: 'Currency' },
    { key: 'PrincipalPaymentAmount2', label: 'PrincipalPaymentAmount2', type: 'Currency' },
    { key: 'PrincipalPaymentAmount3', label: 'PrincipalPaymentAmount3', type: 'Currency' },
    { key: 'PrincipalPaymentAmount4', label: 'PrincipalPaymentAmount4', type: 'Currency' },
    { key: 'InterestPaymentAmount1', label: 'InterestPaymentAmount1', type: 'Currency' },
    { key: 'InterestPaymentAmount2', label: 'InterestPaymentAmount2', type: 'Currency' },
    { key: 'InterestPaymentAmount3', label: 'InterestPaymentAmount3', type: 'Currency' },
    { key: 'InterestPaymentAmount4', label: 'InterestPaymentAmount4', type: 'Currency' },
    { key: 'ContractualPaymentDueDate1', label: 'ContractualPaymentDueDate1', type: 'Date' },
    { key: 'ContractualPaymentDueDate2', label: 'ContractualPaymentDueDate2', type: 'Date' },
    { key: 'ContractualPaymentDueDate3', label: 'ContractualPaymentDueDate3', type: 'Date' },
    { key: 'ContractualPaymentDueDate4', label: 'ContractualPaymentDueDate4', type: 'Date' },
    { key: 'ContractualPaymentAmount1', label: 'ContractualPaymentAmount1', type: 'Currency' },
    { key: 'ContractualPaymentAmount2', label: 'ContractualPaymentAmount2', type: 'Currency' },
    { key: 'ContractualPaymentAmount3', label: 'ContractualPaymentAmount3', type: 'Currency' },
    { key: 'ContractualPaymentAmount4', label: 'ContractualPaymentAmount4', type: 'Currency' },
    { key: 'TrialPaymentRemainingAmount', label: 'TrialPaymentRemainingAmount', type: 'Currency' },
    { key: 'TrialPeriodInterestAmount', label: 'TrialPeriodInterestAmount', type: 'Currency' },
    { key: 'MbsPoolIdentifier', label: 'MbsPoolIdentifier', type: 'Numeric' },
    { key: 'LastReportedUPBAmount', label: 'LastReportedUPBAmount', type: 'Currency' },
    { key: 'PreTrialExpectedPaymentAmount', label: 'PreTrialExpectedPaymentAmount', type: 'Currency' },
    { key: 'EstimatedHazardInsuranceProceeds', label: 'EstimatedHazardInsuranceProceeds', type: 'Currency' },
    { key: 'EstimatedMortgageInsuranceProceeds', label: 'EstimatedMortgageInsuranceProceeds', type: 'Currency' },
    { key: 'ForeclosureSaleDate', label: 'ForeclosureSaleDate', type: 'Date' },
    { key: 'HardshipStartDate1', label: 'HardshipStartDate1', type: 'Date' },
    { key: 'HardshipEndDate1', label: 'HardshipEndDate1', type: 'Date' },
    { key: 'HardshipStartDate2', label: 'HardshipStartDate2', type: 'Date' },
    { key: 'HardshipEndDate2', label: 'HardshipEndDate2', type: 'Date' },
    { key: 'HardshipStartDate3', label: 'HardshipStartDate3', type: 'Date' },
    { key: 'HardshipEndDate3', label: 'HardshipEndDate3', type: 'Date' },
    { key: 'BorrowerPosition1', label: 'BorrowerPosition1', type: 'Numeric' },
    { key: 'BorrowerPosition2', label: 'BorrowerPosition2', type: 'Numeric' },
    { key: 'BorrowerPosition3', label: 'BorrowerPosition3', type: 'Numeric' },
    { key: 'BorrowerPosition4', label: 'BorrowerPosition4', type: 'Numeric' },
    { key: 'BorrowerPosition5', label: 'BorrowerPosition5', type: 'Numeric' },
    { key: 'BorrowerPosition6', label: 'BorrowerPosition6', type: 'Numeric' },
    { key: 'AssetType1', label: 'AssetType1', type: 'LIST' },
    { key: 'AssetType2', label: 'AssetType2', type: 'LIST' },
    { key: 'AssetType3', label: 'AssetType3', type: 'LIST' },
    { key: 'AssetType4', label: 'AssetType4', type: 'LIST' },
    { key: 'AssetType5', label: 'AssetType5', type: 'LIST' },
    { key: 'AssetType6', label: 'AssetType6', type: 'LIST' },
    { key: 'AssetValueAmount1', label: 'AssetValueAmount1', type: 'Currency' },
    { key: 'AssetValueAmount2', label: 'AssetValueAmount2', type: 'Currency' },
    { key: 'AssetValueAmount3', label: 'AssetValueAmount3', type: 'Currency' },
    { key: 'AssetValueAmount4', label: 'AssetValueAmount4', type: 'Currency' },
    { key: 'AssetValueAmount5', label: 'AssetValueAmount5', type: 'Currency' },
    { key: 'AssetValueAmount6', label: 'AssetValueAmount6', type: 'Currency' },
    { key: 'IncomeType1', label: 'IncomeType1', type: 'LIST' },
    { key: 'IncomeType2', label: 'IncomeType2', type: 'LIST' },
    { key: 'IncomeType3', label: 'IncomeType3', type: 'LIST' },
    { key: 'IncomeType4', label: 'IncomeType4', type: 'LIST' },
    { key: 'IncomeType5', label: 'IncomeType5', type: 'LIST' },
    { key: 'IncomeType6', label: 'IncomeType6', type: 'LIST' },
    { key: 'GrossMonthlyIncome2', label: 'GrossMonthlyIncome2', type: 'Currency' },
    { key: 'GrossMonthlyIncome3', label: 'GrossMonthlyIncome3', type: 'Currency' },
    { key: 'GrossMonthlyIncome4', label: 'GrossMonthlyIncome4', type: 'Currency' },
    { key: 'GrossMonthlyIncome5', label: 'GrossMonthlyIncome5', type: 'Currency' },
    { key: 'GrossMonthlyIncome6', label: 'GrossMonthlyIncome6', type: 'Currency' },
    { key: 'BorrowerExpenseType1', label: 'BorrowerExpenseType1', type: 'LIST' },
    { key: 'BorrowerExpenseType2', label: 'BorrowerExpenseType2', type: 'LIST' },
    { key: 'BorrowerExpenseType3', label: 'BorrowerExpenseType3', type: 'LIST' },
    { key: 'BorrowerExpenseType4', label: 'BorrowerExpenseType4', type: 'LIST' },
    { key: 'BorrowerExpenseType5', label: 'BorrowerExpenseType5', type: 'LIST' },
    { key: 'BorrowerExpenseType6', label: 'BorrowerExpenseType6', type: 'LIST' },
    { key: 'Borrower2ExpenseMonthlyPaymentAmount', label: 'Borrower2ExpenseMonthlyPaymentAmount', type: 'Currency' },
    { key: 'Borrower3ExpenseMonthlyPaymentAmount', label: 'Borrower3ExpenseMonthlyPaymentAmount', type: 'Currency' },
    { key: 'Borrower4ExpenseMonthlyPaymentAmount', label: 'Borrower4ExpenseMonthlyPaymentAmount', type: 'Currency' },
    { key: 'Borrower5ExpenseMonthlyPaymentAmount', label: 'Borrower5ExpenseMonthlyPaymentAmount', type: 'Currency' },
    { key: 'Borrower6ExpenseMonthlyPaymentAmount', label: 'Borrower6ExpenseMonthlyPaymentAmount', type: 'Currency' },
    { key: 'PriorWorkoutPaymentReductionPercent', label: 'PriorWorkoutPaymentReductionPercent', type: 'Numeric' },
    { key: 'PriorWorkoutSubsequentDelinquencySeverity', label: 'PriorWorkoutSubsequentDelinquencySeverity', type: 'Numeric' },
    { key: 'PropertyDispositionType', label: 'PropertyDispositionType', type: 'LIST' },
    { key: 'BorrowerOccupancyIndicator1', label: 'BorrowerOccupancyIndicator1', type: 'Boolean' },
    { key: 'BorrowerOccupancyIndicator2', label: 'BorrowerOccupancyIndicator2', type: 'Boolean' },
    { key: 'BorrowerOccupancyIndicator3', label: 'BorrowerOccupancyIndicator3', type: 'Boolean' },
    { key: 'BorrowerOccupancyIndicator4', label: 'BorrowerOccupancyIndicator4', type: 'Boolean' },
    { key: 'BorrowerOccupancyIndicator5', label: 'BorrowerOccupancyIndicator5', type: 'Boolean' },
    { key: 'BorrowerOccupancyIndicator6', label: 'BorrowerOccupancyIndicator6', type: 'Boolean' },
    { key: 'SCRAReliefType', label: 'SCRAReliefType', type: 'LIST' },
    { key: 'SubordinateFinancingAmount', label: 'SubordinateFinancingAmount', type: 'Currency' },
    { key: 'PreWorkoutUPBAtTrial', label: 'PreWorkoutUPBAtTrial', type: 'Currency' },
    { key: 'LastGrossUPBReportedToSir', label: 'LastGrossUPBReportedToSir', type: 'Currency' },
    { key: 'TrialEligibilityDate', label: 'TrialEligibilityDate', type: 'Date' },
    { key: 'LoanPaymentFrequencyCode', label: 'LoanPaymentFrequencyCode', type: 'LIST' },
    { key: 'LoanRemittanceTypeCode', label: 'LoanRemittanceTypeCode', type: 'LIST' },
    { key: 'PropertyRepairCostAmount', label: 'PropertyRepairCostAmount', type: 'Currency' },
    { key: 'DelinquentInterestThroughSubmissionDateAmount', label: 'DelinquentInterestThroughSubmissionDateAmount', type: 'Currency' },
    { key: 'LoanForeclosureSaleDateTypeCode', label: 'LoanForeclosureSaleDateTypeCode', type: 'LIST' },
    { key: 'BorrowerBankruptcyIndicator1', label: 'BorrowerBankruptcyIndicator1', type: 'Boolean' },
    { key: 'BorrowerBankruptcyIndicator2', label: 'BorrowerBankruptcyIndicator2', type: 'Boolean' },
    { key: 'BorrowerBankruptcyIndicator3', label: 'BorrowerBankruptcyIndicator3', type: 'Boolean' },
    { key: 'BorrowerBankruptcyIndicator4', label: 'BorrowerBankruptcyIndicator4', type: 'Boolean' },
    { key: 'BorrowerBankruptcyIndicator5', label: 'BorrowerBankruptcyIndicator5', type: 'Boolean' },
    { key: 'BorrowerBankruptcyIndicator6', label: 'BorrowerBankruptcyIndicator6', type: 'Boolean' },
    { key: 'LitigationDescriptionType', label: 'LitigationDescriptionType', type: 'LIST' },
    { key: 'LitigationStatusType', label: 'LitigationStatusType', type: 'LIST' },
    { key: 'LitigationStatusDate', label: 'LitigationStatusDate', type: 'Date' },
    { key: 'LitigationSubjectPropertyIndicator', label: 'LitigationSubjectPropertyIndicator', type: 'Boolean' },
    { key: 'LitigationTitleConveyanceLimitationIndicator', label: 'LitigationTitleConveyanceLimitationIndicator', type: 'Boolean' },
    { key: 'BankruptcyReaffirmationIndicator', label: 'BankruptcyReaffirmationIndicator', type: 'Boolean' },
    { key: 'OtherRelocationAssistanceAmount', label: 'OtherRelocationAssistanceAmount', type: 'Currency' },
    { key: 'PurchaseOfferReceivedDate', label: 'PurchaseOfferReceivedDate', type: 'Date' },
    { key: 'PurchaseOfferAmount', label: 'PurchaseOfferAmount', type: 'Currency' },
    { key: 'PurchaseOfferClosingDate', label: 'PurchaseOfferClosingDate', type: 'Date' },
    { key: 'NetSalesProceedsAmount', label: 'NetSalesProceedsAmount', type: 'Currency' },
    { key: 'SubjectPropertyMarketRentAmount', label: 'SubjectPropertyMarketRentAmount', type: 'Currency' },
    { key: 'DisasterName1', label: 'DisasterName1', type: 'String' },
    { key: 'DisasterName2', label: 'DisasterName2', type: 'String' },
    { key: 'DisasterName3', label: 'DisasterName3', type: 'String' },
    { key: 'ServicerAttorneyContactName', label: 'ServicerAttorneyContactName', type: 'String' },
    { key: 'ProvisionalPaymentPeriodAgreementDate', label: 'ProvisionalPaymentPeriodAgreementDate', type: 'Date' },
    { key: 'IncomeTypeOtherDescription1', label: 'IncomeTypeOtherDescription1', type: 'String' },
    { key: 'IncomeTypeOtherDescription2', label: 'IncomeTypeOtherDescription2', type: 'String' },
    { key: 'IncomeTypeOtherDescription3', label: 'IncomeTypeOtherDescription3', type: 'String' },
    { key: 'IncomeTypeOtherDescription4', label: 'IncomeTypeOtherDescription4', type: 'String' },
    { key: 'IncomeTypeOtherDescription5', label: 'IncomeTypeOtherDescription5', type: 'String' },
    { key: 'IncomeTypeOtherDescription6', label: 'IncomeTypeOtherDescription6', type: 'String' },
    { key: 'BankruptcyFilingDate', label: 'BankruptcyFilingDate', type: 'Date' },
    { key: 'CreditScoreType1', label: 'CreditScoreType1', type: 'LIST' },
    { key: 'CreditScoreType2', label: 'CreditScoreType2', type: 'LIST' },
    { key: 'CreditScoreType3', label: 'CreditScoreType3', type: 'LIST' },
    { key: 'CreditScoreType4', label: 'CreditScoreType4', type: 'LIST' },
    { key: 'CreditScoreType5', label: 'CreditScoreType5', type: 'LIST' },
    { key: 'CreditScoreType6', label: 'CreditScoreType6', type: 'LIST' },
    { key: 'NewMortgageObtainedIndicator', label: 'NewMortgageObtainedIndicator', type: 'Boolean' },
    { key: 'DeathCertificateReceivedIndicator', label: 'DeathCertificateReceivedIndicator', type: 'Boolean' },
    { key: 'OtherExpenseTypeDescription1', label: 'OtherExpenseTypeDescription1', type: 'String' },
    { key: 'OtherExpenseTypeDescription2', label: 'OtherExpenseTypeDescription2', type: 'String' },
    { key: 'OtherExpenseTypeDescription3', label: 'OtherExpenseTypeDescription3', type: 'String' },
    { key: 'OtherExpenseTypeDescription4', label: 'OtherExpenseTypeDescription4', type: 'String' },
    { key: 'OtherExpenseTypeDescription5', label: 'OtherExpenseTypeDescription5', type: 'String' },
    { key: 'OtherExpenseTypeDescription6', label: 'OtherExpenseTypeDescription6', type: 'String' },
    { key: 'ServicerImminentDefaultEvaluationDate', label: 'ServicerImminentDefaultEvaluationDate', type: 'Date' },
    { key: 'Number30DaysDelinquentIn6Months', label: 'Number30DaysDelinquentIn6Months', type: 'Numeric' },
    { key: 'BRPSubmissionIndicator', label: 'BRPSubmissionIndicator', type: 'Boolean' },
    { key: 'RepaymentPlanTotalAmountDue', label: 'RepaymentPlanTotalAmountDue', type: 'Currency' },
    { key: 'NonFemaDisasterHardshipIndicator', label: 'NonFemaDisasterHardshipIndicator', type: 'Boolean' },
    { key: 'MediationIndicator', label: 'MediationIndicator', type: 'Boolean' },
    { key: 'BorrowerQRPCIndicator', label: 'BorrowerQRPCIndicator', type: 'Boolean' },
    { key: 'LoanLastPaymentAppliedDate', label: 'LoanLastPaymentAppliedDate', type: 'Date' },
    { key: 'LoanConsecutiveDelinquentMonthsCount', label: 'LoanConsecutiveDelinquentMonthsCount', type: 'Numeric' },
    { key: 'LoanProcessingMonthIndicator', label: 'LoanProcessingMonthIndicator', type: 'Boolean' },
    { key: 'BorrowerFailedNonDisasterTrialIndicator', label: 'BorrowerFailedNonDisasterTrialIndicator', type: 'Boolean' },
    { key: 'BorrowerImpactedByCovid19Indicator', label: 'BorrowerImpactedByCovid19Indicator', type: 'Boolean' },
    { key: 'LoanPrincipalDeferredAmount', label: 'LoanPrincipalDeferredAmount', type: 'Currency' },
    { key: 'LoanInterestDeferredAmount', label: 'LoanInterestDeferredAmount', type: 'Currency' },
    { key: 'BorrowerCOVID19DefaultIndicator', label: 'BorrowerCOVID19DefaultIndicator', type: 'Boolean' },
    { key: 'BorrowerHardshipDueToNewDisasterEventIndicator', label: 'BorrowerHardshipDueToNewDisasterEventIndicator', type: 'Boolean' },
    { key: 'BorrowerDisasterPaymentDeferralDefaultIndicator', label: 'BorrowerDisasterPaymentDeferralDefaultIndicator', type: 'Boolean' },
    { key: 'BorrowerSpecialCreditReportingIndicator', label: 'BorrowerSpecialCreditReportingIndicator', type: 'Boolean' },
    { key: 'LoanRPPContractualPaymentChangeMonth', label: 'LoanRPPContractualPaymentChangeMonth', type: 'Numeric' },
    { key: 'LoanRPPContractualPaymentChangeAmount', label: 'LoanRPPContractualPaymentChangeAmount', type: 'Currency' },
    { key: 'BorrowerPaymentDeferralDefaultIndicator', label: 'BorrowerPaymentDeferralDefaultIndicator', type: 'Boolean' },
    { key: 'LoanRecourseTypeCode', label: 'LoanRecourseTypeCode', type: 'LIST' },
    { key: 'AssumptionIndicator1', label: 'AssumptionIndicator1', type: 'Boolean' },
    { key: 'IncludePSAEvaluationIndicator', label: 'IncludePSAEvaluationIndicator', type: 'Boolean' },
    { key: 'BorrowerAttestationDocumentReceivedIndicator', label: 'BorrowerAttestationDocumentReceivedIndicator', type: 'Boolean' },
    { key: 'DecisionVersion', label: 'DecisionVersion', type: 'LIST' },
    { key: 'WillingToRetainProperty', label: 'WillingToRetainProperty', type: 'Boolean' },
    { key: 'LeaseholdPropertyTermsRemain', label: 'LeaseholdPropertyTermsRemain', type: 'Boolean' },
    { key: 'RepaymentWithActiveOffer', label: 'RepaymentWithActiveOffer', type: 'Boolean' },
    { key: 'ReinstatementViable', label: 'ReinstatementViable', type: 'Boolean' },
    { key: 'GrossRentalIncome', label: 'GrossRentalIncome', type: 'Currency' },
    { key: 'ModificationTrialPlanEndDate', label: 'ModificationTrialPlanEndDate', type: 'Date' },
    { key: 'PropertyPreservationAmount', label: 'PropertyPreservationAmount', type: 'Currency' },
    { key: 'PrResMortgagePITIAS', label: 'PrResMortgagePITIAS', type: 'Currency' },
    { key: 'ReportedFirstPaymentDueDate', label: 'ReportedFirstPaymentDueDate', type: 'Date' },
    { key: 'SignedFinalDocsReceivedDate', label: 'SignedFinalDocsReceivedDate', type: 'Date' },
    { key: 'TotalCashReserveAmount', label: 'TotalCashReserveAmount', type: 'Currency' },
    { key: 'HardshipReasonCommentforReasonOther', label: 'HardshipReasonCommentforReasonOther', type: 'String' },
    { key: 'DisasterType', label: 'DisasterType', type: 'LIST' },
    { key: 'DisasterCountyCode', label: 'DisasterCountyCode', type: 'String' },
    { key: 'AppealReviewRequestIndicator', label: 'AppealReviewRequestIndicator', type: 'Boolean' },
    { key: 'AppealReviewRequestIdentifier', label: 'AppealReviewRequestIdentifier', type: 'String' },
    { key: 'BorrowerResponsePackageReceivedDate', label: 'BorrowerResponsePackageReceivedDate', type: 'Date' },
    { key: 'BorrowerType', label: 'BorrowerType', type: 'LIST' },
    { key: 'Borrower1CreditScoreDate', label: 'Borrower1CreditScoreDate', type: 'Date' },
    { key: 'Borrower2CreditScoreDate', label: 'Borrower2CreditScoreDate', type: 'Date' }
];

export interface ColumnMapping {
    sourceColumn: string;
    targetField: string | null;
}

export const splitColumn = (
    row: any,
    sourceColumn: string,
    delimiter: string = ' ',
    targetFields: [string, string],
    splitStrategy: 'first' | 'last' = 'first'
) => {
    let value = row[sourceColumn];
    const newRow = { ...row };

    // Initialize targets to empty strings to ensure keys exist
    newRow[targetFields[0]] = '';
    newRow[targetFields[1]] = '';

    if (value === null || value === undefined) return newRow;
    value = String(value);

    // If delimiter is empty, split is impossible, but we pass full value to first field
    if (!delimiter) {
        newRow[targetFields[0]] = value;
        return newRow;
    }

    const parts = value.split(delimiter);
    if (parts.length < 2) {
        newRow[targetFields[0]] = value;
        return newRow;
    }

    if (splitStrategy === 'last') {
        const lastPart = parts.pop();
        const firstPart = parts.join(delimiter);
        newRow[targetFields[0]] = firstPart;
        newRow[targetFields[1]] = lastPart || '';
    } else {
        const firstPart = parts.shift();
        const lastPart = parts.join(delimiter);
        newRow[targetFields[0]] = firstPart || '';
        newRow[targetFields[1]] = lastPart;
    }

    return newRow;
};

export const mapRow = (row: any, mappings: ColumnMapping[]) => {
    const mappedRow: any = {};
    mappings.forEach(mapping => {
        if (mapping.targetField && row[mapping.sourceColumn] !== undefined) {
            mappedRow[mapping.targetField] = row[mapping.sourceColumn];
        }
    });
    return mappedRow;
};
export const combineColumns = (
    row: any,
    col1: string,
    col2: string,
    delimiter: string = ' ',
    targetColumn: string
) => {
    const val1 = row[col1];
    const val2 = row[col2];

    const part1 = (val1 === null || val1 === undefined) ? '' : String(val1);
    const part2 = (val2 === null || val2 === undefined) ? '' : String(val2);

    const check1 = part1.trim();
    const check2 = part2.trim();

    let combined = '';
    if (check1 && check2) {
        combined = `${part1}${delimiter}${part2}`;
    } else if (check1) {
        combined = part1;
    } else if (check2) {
        combined = part2;
    }

    return { ...row, [targetColumn]: combined };
};

// Levenshtein distance for fuzzy matching
const getLevenshteinDistance = (a: string, b: string): number => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

export const getBestMatch = (sourceColumn: string, targetOptions: InternalField[]): string | null => {
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const sourceNorm = normalize(sourceColumn);

    let bestMatch: string | null = null;
    let minDistance = Infinity;

    // First try exact match (case-insensitive)
    const exact = targetOptions.find(t => normalize(t.label) === sourceNorm || normalize(t.key) === sourceNorm);
    if (exact) return exact.key;

    // Fuzzy match
    for (const option of targetOptions) {
        const targetNorm = normalize(option.label);
        const distance = getLevenshteinDistance(sourceNorm, targetNorm);

        // Calculate similarity score (0 to 1)
        const maxLength = Math.max(sourceNorm.length, targetNorm.length);
        const similarity = 1 - (distance / maxLength);

        // Threshold of 0.4 means 40% similarity required. 
        // For short words like "Name" vs "F. Name" specific heuristics might be better
        // but general levenshtein works well for typos.
        if (similarity > 0.4 && distance < minDistance) {
            minDistance = distance;
            bestMatch = option.key;
        }
    }

    return bestMatch;
};
