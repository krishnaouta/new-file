export interface InternalField {
    key: string;
    label: string;
    required?: boolean;
}

export const internalFields: InternalField[] = [
    { key: 'ServicerName', label: 'ServicerName' },
    { key: 'InvestorCode', label: 'InvestorCode' },
    { key: 'LoanNumber', label: 'LoanNumber' },
    { key: 'InvestorLoanIdentifier', label: 'InvestorLoanIdentifier' },
    { key: 'PLS_ID', label: 'PLS_ID' },
    { key: 'PrincipalandInterestPaymentAmount', label: 'PrincipalandInterestPaymentAmount' },
    { key: 'EscrowsWaivedIndicator', label: 'EscrowsWaivedIndicator' },
    { key: 'LoanAmortizationTypeCode', label: 'LoanAmortizationTypeCode' },
    { key: 'PropertyTypeCode', label: 'PropertyTypeCode' },
    { key: 'CapitalizedTotalAmount', label: 'CapitalizedTotalAmount' },
    { key: 'PropertyOccupancyStatusCode', label: 'PropertyOccupancyStatusCode' },
    { key: 'UnpaidPrincipalBalanceAmount', label: 'UnpaidPrincipalBalanceAmount' },
    { key: 'Mod_Lien_Original_Loan_Bal', label: 'Mod_Lien_Original_Loan_Bal' },
    { key: 'EscrowPaymentAmount', label: 'EscrowPaymentAmount' },
    { key: 'CurrentLastPaidInstallmentDate', label: 'CurrentLastPaidInstallmentDate' },
    { key: 'LoanRemainingTerm', label: 'LoanRemainingTerm' },
    { key: 'ExistingForbearanceAmount', label: 'ExistingForbearanceAmount' },
    { key: 'CapitalizedFees', label: 'CapitalizedFees' },
    { key: 'GrossMonthlyIncome', label: 'GrossMonthlyIncome' },
    { key: 'CurrentInterestRate', label: 'CurrentInterestRate' },
    { key: 'LoanEscrowAdvanceAmount', label: 'LoanEscrowAdvanceAmount' },
    { key: 'ForeclosureStatusCode', label: 'ForeclosureStatusCode' },
    { key: 'LoanRunType', label: 'LoanRunType' },
    { key: 'LoanInForeclosureIndicator', label: 'LoanInForeclosureIndicator' },
    { key: 'HardshipDurationTypeCode', label: 'HardshipDurationTypeCode' },
    { key: 'MonthlyHousingExpense', label: 'MonthlyHousingExpense' },
    { key: 'MortgageInsuranceIndicator', label: 'MortgageInsuranceIndicator' },
    { key: 'LoanPriorModificationIndicator', label: 'LoanPriorModificationIndicator' },
    { key: 'HardshipReasonCode1', label: 'HardshipReasonCode1' },
    { key: 'EscrowedHazardInsuranceIndicator', label: 'EscrowedHazardInsuranceIndicator' },
    { key: 'EscrowedPropertyTaxIndicator', label: 'EscrowedPropertyTaxIndicator' },
    { key: 'LoanImminentDefaultIndicator', label: 'LoanImminentDefaultIndicator' },
    { key: 'MonthlyHazardInsuranceAmount', label: 'MonthlyHazardInsuranceAmount' },
    { key: 'MonthlyMortgageInsuranceAmount', label: 'MonthlyMortgageInsuranceAmount' },
    { key: 'MonthlyRealEstateTaxAmount', label: 'MonthlyRealEstateTaxAmount' },
    { key: 'AmortizationTermatOrigination', label: 'AmortizationTermatOrigination' },
    { key: 'LienTypeCode', label: 'LienTypeCode' },
    { key: 'LoanOriginalMaturityDate', label: 'LoanOriginalMaturityDate' },
    { key: 'PropertyConditionCode', label: 'PropertyConditionCode' },
    { key: 'PropertyValuationAmount', label: 'PropertyValuationAmount' },
    { key: 'PropertyValuationDate', label: 'PropertyValuationDate' },
    { key: 'MonthlyHOAAmount', label: 'MonthlyHOAAmount' },
    { key: 'FutureEscrowShortagePaymentAmount', label: 'FutureEscrowShortagePaymentAmount' },
    { key: 'MonthlyFloodInsuranceAmount', label: 'MonthlyFloodInsuranceAmount' },
    { key: 'EscrowedFloodInsuranceIndicator', label: 'EscrowedFloodInsuranceIndicator' },
    { key: 'MonthlyExpenseAmount', label: 'MonthlyExpenseAmount' },
    { key: 'PriorWorkoutTypeCode1', label: 'PriorWorkoutTypeCode1' },
    { key: 'PriorWorkoutStatusTypeCode1', label: 'PriorWorkoutStatusTypeCode1' },
    { key: 'LateCharges', label: 'LateCharges' },
    { key: 'Borrower1_FirstName', label: 'Borrower1_FirstName' },
    { key: 'Borrower1_LastName', label: 'Borrower1_LastName' },
    { key: 'PropertyAddress', label: 'PropertyAddress' },
    { key: 'NetMonthlyIncome', label: 'NetMonthlyIncome' },
    { key: 'PropertyCity', label: 'PropertyCity' },
    { key: 'VerifiedHardshipIndicator', label: 'VerifiedHardshipIndicator' },
    { key: 'CreditReportIndicator', label: 'CreditReportIndicator' },
    { key: 'PropertyCounty', label: 'PropertyCounty' },
    { key: 'PropertyStateCode', label: 'PropertyStateCode' },
    { key: 'PropertyZip', label: 'PropertyZip' },
    { key: 'CreditLiabilityAmount', label: 'CreditLiabilityAmount' },
    { key: 'TrialInterestRate', label: 'TrialInterestRate' },
    { key: 'BorrowerContributionAmount', label: 'BorrowerContributionAmount' },
    { key: 'SuspenseBalanceAmount', label: 'SuspenseBalanceAmount' },
    { key: 'CurrentEscrowShortagePaymentAmount', label: 'CurrentEscrowShortagePaymentAmount' },
    { key: 'VerifiedStableIncomeIndicator', label: 'VerifiedStableIncomeIndicator' },
    { key: 'DisasterDeclaredDate', label: 'DisasterDeclaredDate' },
    { key: 'PriorWorkoutCompletedDate1', label: 'PriorWorkoutCompletedDate1' },
    { key: 'ResumeMonthlyPaymentsEvidenceIndicator', label: 'ResumeMonthlyPaymentsEvidenceIndicator' },
    { key: 'TotalEscrowShortagePaymentAmount', label: 'TotalEscrowShortagePaymentAmount' },
    { key: 'AccumulatedLateFeesWaivedIndicator', label: 'AccumulatedLateFeesWaivedIndicator' },
    { key: 'HardshipDocumentReceivedIndicator', label: 'HardshipDocumentReceivedIndicator' },
    { key: 'EscrowedAssociationDuesIndicator', label: 'EscrowedAssociationDuesIndicator' },
    { key: 'EscrowShortageRepayMonths', label: 'EscrowShortageRepayMonths' },
    { key: 'DateofOriginalNote', label: 'DateofOriginalNote' },
    { key: 'PropertyNumberofUnits', label: 'PropertyNumberofUnits' },
    { key: 'PropertyUsageTypeCode', label: 'PropertyUsageTypeCode' },
    { key: 'UPBofExistingPartialClaim', label: 'UPBofExistingPartialClaim' },
    { key: 'FutureMonthlyRealEstateTaxAmount', label: 'FutureMonthlyRealEstateTaxAmount' },
    { key: 'FutureMonthlyHOAAmount', label: 'FutureMonthlyHOAAmount' },
    { key: 'FutureMonthlyMortgageInsuranceAmount', label: 'FutureMonthlyMortgageInsuranceAmount' },
    { key: 'FutureMonthlyHazardInsuranceAmount', label: 'FutureMonthlyHazardInsuranceAmount' },
    { key: 'FutureMonthlyFloodInsuranceAmount', label: 'FutureMonthlyFloodInsuranceAmount' },
    { key: 'ModifiedMortgagePaymentBorrowerConsentIndicator', label: 'ModifiedMortgagePaymentBorrowerConsentIndicator' },
    { key: 'BorrowerHardshipStatusCode', label: 'BorrowerHardshipStatusCode' },
    { key: 'ForbearancePaymentAffordabilityIndicator', label: 'ForbearancePaymentAffordabilityIndicator' },
    { key: 'RePayDebtWithinSixMonthsIndicator', label: 'RePayDebtWithinSixMonthsIndicator' },
    { key: 'LoanPreviousModDate', label: 'LoanPreviousModDate' },
    { key: 'PriorWorkoutActivityTypeCode1', label: 'PriorWorkoutActivityTypeCode1' },
    { key: 'PriorWorkoutFailOrCancelReasonTypeCode1', label: 'PriorWorkoutFailOrCancelReasonTypeCode1' },
    { key: 'PriorWorkoutStatusDate1', label: 'PriorWorkoutStatusDate1' },
    { key: 'OtherAdvancesForCapitalization', label: 'OtherAdvancesForCapitalization' },
    { key: 'CapitalizedInterestAmount', label: 'CapitalizedInterestAmount' },
    { key: 'FirstPermPaymentDueDate', label: 'FirstPermPaymentDueDate' },
    { key: 'FirstTrialPaymentDueDate', label: 'FirstTrialPaymentDueDate' },
    { key: 'LoanMortgageTypeCode', label: 'LoanMortgageTypeCode' },
    { key: 'CoBorrowerIndicator', label: 'CoBorrowerIndicator' },
    { key: 'AdditionalCoBorrower1Indicator', label: 'AdditionalCoBorrower1Indicator' },
    { key: 'AdditionalCoBorrower2Indicator', label: 'AdditionalCoBorrower2Indicator' },
    { key: 'AdditionalCoBorrower3Indicator', label: 'AdditionalCoBorrower3Indicator' },
    { key: 'NonBorrowerIndicator', label: 'NonBorrowerIndicator' },
    { key: 'PCEscrowOverage', label: 'PCEscrowOverage' },
    { key: 'NumberofPreviousMod', label: 'NumberofPreviousMod' },
    { key: 'BankruptcyType1', label: 'BankruptcyType1' },
    { key: 'BankruptcyStatusType1', label: 'BankruptcyStatusType1' },
    { key: 'BorrowerCurrentLegalOwnerIndicator', label: 'BorrowerCurrentLegalOwnerIndicator' },
    { key: 'LoanCurrentOrLessThan30DaysPastDueFromDisasterDeclaredIndicator', label: 'LoanCurrentOrLessThan30DaysPastDueFromDisasterDeclaredIndicator' },
    { key: 'InvestorApprovalIndicator', label: 'InvestorApprovalIndicator' },
    { key: 'FirstPaymentDateatOrigination', label: 'FirstPaymentDateatOrigination' },
    { key: 'TrialPeriod', label: 'TrialPeriod' },
    { key: 'DelinquencyUnresolved12MonthIndicator', label: 'DelinquencyUnresolved12MonthIndicator' },
    { key: 'TheborrowerNoGreaterthan120dayspastDue', label: 'TheborrowerNoGreaterthan120dayspastDue' },
    { key: 'InitialForbearanceRequest', label: 'InitialForbearanceRequest' },
    { key: 'LastApprovedPSAWithin36MonthsIndicator', label: 'LastApprovedPSAWithin36MonthsIndicator' },
    { key: 'ServicerLoanIdentifier', label: 'ServicerLoanIdentifier' },
    { key: 'FannieMaeServicerIdentifier', label: 'FannieMaeServicerIdentifier' },
    { key: 'WorkoutTypeCode', label: 'WorkoutTypeCode' },
    { key: 'UseAssociatedTrialIndicator', label: 'UseAssociatedTrialIndicator' },
    { key: 'CampaignTrialPeriodLength', label: 'CampaignTrialPeriodLength' },
    { key: 'RequestID', label: 'RequestID' },
    { key: 'Borrower2_FirstName', label: 'Borrower2_FirstName' },
    { key: 'Borrower2_LastName', label: 'Borrower2_LastName' },
    { key: 'Borrower3_FirstName', label: 'Borrower3_FirstName' },
    { key: 'Borrower3_LastName', label: 'Borrower3_LastName' },
    { key: 'Borrower4_FirstName', label: 'Borrower4_FirstName' },
    { key: 'Borrower4_LastName', label: 'Borrower4_LastName' },
    { key: 'Borrower5_FirstName', label: 'Borrower5_FirstName' },
    { key: 'Borrower5_LastName', label: 'Borrower5_LastName' },
    { key: 'Borrower6_FirstName', label: 'Borrower6_FirstName' },
    { key: 'Borrower6_LastName', label: 'Borrower6_LastName' },
    { key: 'Borrower1CreditScore', label: 'Borrower1CreditScore' },
    { key: 'Borrower2CreditScore', label: 'Borrower2CreditScore' },
    { key: 'Borrower3CreditScore', label: 'Borrower3CreditScore' },
    { key: 'Borrower4CreditScore', label: 'Borrower4CreditScore' },
    { key: 'Borrower5CreditScore', label: 'Borrower5CreditScore' },
    { key: 'Borrower6CreditScore', label: 'Borrower6CreditScore' },
    { key: 'PropertyAddressStreetLine2', label: 'PropertyAddressStreetLine2' },
    { key: 'NextARMResetRate', label: 'NextARMResetRate' },
    { key: 'NextARMResetDate', label: 'NextARMResetDate' },
    { key: 'LifetimeInterestRateCapForARMLoans', label: 'LifetimeInterestRateCapForARMLoans' },
    { key: 'FinalInterestRateForStepRateLoans', label: 'FinalInterestRateForStepRateLoans' },
    { key: 'ValuationTypeCode', label: 'ValuationTypeCode' },
    { key: 'InterestRateatOrigination', label: 'InterestRateatOrigination' },
    { key: 'OriginalNoteAmount', label: 'OriginalNoteAmount' },
    { key: 'LoanEscrowShortagePaybackDurationMonthCount', label: 'LoanEscrowShortagePaybackDurationMonthCount' },
    { key: 'EscrowProhibitedByLawIndicator', label: 'EscrowProhibitedByLawIndicator' },
    { key: 'ForgivenInterestAmount', label: 'ForgivenInterestAmount' },
    { key: 'AttorneyCosts', label: 'AttorneyCosts' },
    { key: 'LoanCurrentEscrowAdvanceAmount', label: 'LoanCurrentEscrowAdvanceAmount' },
    { key: 'HardshipReasonCode2', label: 'HardshipReasonCode2' },
    { key: 'HardshipReasonCode3', label: 'HardshipReasonCode3' },
    { key: 'MICompanyName', label: 'MICompanyName' },
    { key: 'InsuranceCoveragePercent', label: 'InsuranceCoveragePercent' },
    { key: 'MIPartialClaimAmount', label: 'MIPartialClaimAmount' },
    { key: 'MortgageInsuranceContactName', label: 'MortgageInsuranceContactName' },
    { key: 'MortgageInsuranceRequiredBorrowerContributionAmount', label: 'MortgageInsuranceRequiredBorrowerContributionAmount' },
    { key: 'MortgageInsuranceDecision', label: 'MortgageInsuranceDecision' },
    { key: 'MortgageInsuranceContactPhoneNumber', label: 'MortgageInsuranceContactPhoneNumber' },
    { key: 'MICertificateNumber', label: 'MICertificateNumber' },
    { key: 'MIDecisionComment', label: 'MIDecisionComment' },
    { key: 'MBSPoolIssueDate', label: 'MBSPoolIssueDate' },
    { key: 'PMMSRateLockDate', label: 'PMMSRateLockDate' },
    { key: 'DataCollectionDate', label: 'DataCollectionDate' },
    { key: 'DiscountRateRiskPremium', label: 'DiscountRateRiskPremium' },
    { key: 'PrincipalPaymentAmount1', label: 'PrincipalPaymentAmount1' },
    { key: 'PrincipalPaymentAmount2', label: 'PrincipalPaymentAmount2' },
    { key: 'PrincipalPaymentAmount3', label: 'PrincipalPaymentAmount3' },
    { key: 'PrincipalPaymentAmount4', label: 'PrincipalPaymentAmount4' },
    { key: 'InterestPaymentAmount1', label: 'InterestPaymentAmount1' },
    { key: 'InterestPaymentAmount2', label: 'InterestPaymentAmount2' },
    { key: 'InterestPaymentAmount3', label: 'InterestPaymentAmount3' },
    { key: 'InterestPaymentAmount4', label: 'InterestPaymentAmount4' },
    { key: 'ContractualPaymentDueDate1', label: 'ContractualPaymentDueDate1' },
    { key: 'ContractualPaymentDueDate2', label: 'ContractualPaymentDueDate2' },
    { key: 'ContractualPaymentDueDate3', label: 'ContractualPaymentDueDate3' },
    { key: 'ContractualPaymentDueDate4', label: 'ContractualPaymentDueDate4' },
    { key: 'ContractualPaymentAmount1', label: 'ContractualPaymentAmount1' },
    { key: 'ContractualPaymentAmount2', label: 'ContractualPaymentAmount2' },
    { key: 'ContractualPaymentAmount3', label: 'ContractualPaymentAmount3' },
    { key: 'ContractualPaymentAmount4', label: 'ContractualPaymentAmount4' },
    { key: 'TrialPaymentRemainingAmount', label: 'TrialPaymentRemainingAmount' },
    { key: 'TrialPeriodInterestAmount', label: 'TrialPeriodInterestAmount' },
    { key: 'MbsPoolIdentifier', label: 'MbsPoolIdentifier' },
    { key: 'LastReportedUPBAmount', label: 'LastReportedUPBAmount' },
    { key: 'PreTrialExpectedPaymentAmount', label: 'PreTrialExpectedPaymentAmount' },
    { key: 'EstimatedHazardInsuranceProceeds', label: 'EstimatedHazardInsuranceProceeds' },
    { key: 'EstimatedMortgageInsuranceProceeds', label: 'EstimatedMortgageInsuranceProceeds' },
    { key: 'ForeclosureSaleDate', label: 'ForeclosureSaleDate' },
    { key: 'HardshipStartDate1', label: 'HardshipStartDate1' },
    { key: 'HardshipEndDate1', label: 'HardshipEndDate1' },
    { key: 'HardshipStartDate2', label: 'HardshipStartDate2' },
    { key: 'HardshipEndDate2', label: 'HardshipEndDate2' },
    { key: 'HardshipStartDate3', label: 'HardshipStartDate3' },
    { key: 'HardshipEndDate3', label: 'HardshipEndDate3' },
    { key: 'BorrowerPosition1', label: 'BorrowerPosition1' },
    { key: 'BorrowerPosition2', label: 'BorrowerPosition2' },
    { key: 'BorrowerPosition3', label: 'BorrowerPosition3' },
    { key: 'BorrowerPosition4', label: 'BorrowerPosition4' },
    { key: 'BorrowerPosition5', label: 'BorrowerPosition5' },
    { key: 'BorrowerPosition6', label: 'BorrowerPosition6' },
    { key: 'AssetType1', label: 'AssetType1' },
    { key: 'AssetType2', label: 'AssetType2' },
    { key: 'AssetType3', label: 'AssetType3' },
    { key: 'AssetType4', label: 'AssetType4' },
    { key: 'AssetType5', label: 'AssetType5' },
    { key: 'AssetType6', label: 'AssetType6' },
    { key: 'AssetValueAmount1', label: 'AssetValueAmount1' },
    { key: 'AssetValueAmount2', label: 'AssetValueAmount2' },
    { key: 'AssetValueAmount3', label: 'AssetValueAmount3' },
    { key: 'AssetValueAmount4', label: 'AssetValueAmount4' },
    { key: 'AssetValueAmount5', label: 'AssetValueAmount5' },
    { key: 'AssetValueAmount6', label: 'AssetValueAmount6' },
    { key: 'IncomeType1', label: 'IncomeType1' },
    { key: 'IncomeType2', label: 'IncomeType2' },
    { key: 'IncomeType3', label: 'IncomeType3' },
    { key: 'IncomeType4', label: 'IncomeType4' },
    { key: 'IncomeType5', label: 'IncomeType5' },
    { key: 'IncomeType6', label: 'IncomeType6' },
    { key: 'GrossMonthlyIncome2', label: 'GrossMonthlyIncome2' },
    { key: 'GrossMonthlyIncome3', label: 'GrossMonthlyIncome3' },
    { key: 'GrossMonthlyIncome4', label: 'GrossMonthlyIncome4' },
    { key: 'GrossMonthlyIncome5', label: 'GrossMonthlyIncome5' },
    { key: 'GrossMonthlyIncome6', label: 'GrossMonthlyIncome6' },
    { key: 'BorrowerExpenseType1', label: 'BorrowerExpenseType1' },
    { key: 'BorrowerExpenseType2', label: 'BorrowerExpenseType2' },
    { key: 'BorrowerExpenseType3', label: 'BorrowerExpenseType3' },
    { key: 'BorrowerExpenseType4', label: 'BorrowerExpenseType4' },
    { key: 'BorrowerExpenseType5', label: 'BorrowerExpenseType5' },
    { key: 'BorrowerExpenseType6', label: 'BorrowerExpenseType6' },
    { key: 'Borrower2ExpenseMonthlyPaymentAmount', label: 'Borrower2ExpenseMonthlyPaymentAmount' },
    { key: 'Borrower3ExpenseMonthlyPaymentAmount', label: 'Borrower3ExpenseMonthlyPaymentAmount' },
    { key: 'Borrower4ExpenseMonthlyPaymentAmount', label: 'Borrower4ExpenseMonthlyPaymentAmount' },
    { key: 'Borrower5ExpenseMonthlyPaymentAmount', label: 'Borrower5ExpenseMonthlyPaymentAmount' },
    { key: 'Borrower6ExpenseMonthlyPaymentAmount', label: 'Borrower6ExpenseMonthlyPaymentAmount' },
    { key: 'PriorWorkoutPaymentReductionPercent', label: 'PriorWorkoutPaymentReductionPercent' },
    { key: 'PriorWorkoutSubsequentDelinquencySeverity', label: 'PriorWorkoutSubsequentDelinquencySeverity' },
    { key: 'PropertyDispositionType', label: 'PropertyDispositionType' },
    { key: 'BorrowerOccupancyIndicator1', label: 'BorrowerOccupancyIndicator1' },
    { key: 'BorrowerOccupancyIndicator2', label: 'BorrowerOccupancyIndicator2' },
    { key: 'BorrowerOccupancyIndicator3', label: 'BorrowerOccupancyIndicator3' },
    { key: 'BorrowerOccupancyIndicator4', label: 'BorrowerOccupancyIndicator4' },
    { key: 'BorrowerOccupancyIndicator5', label: 'BorrowerOccupancyIndicator5' },
    { key: 'BorrowerOccupancyIndicator6', label: 'BorrowerOccupancyIndicator6' },
    { key: 'SCRAReliefType', label: 'SCRAReliefType' },
    { key: 'SubordinateFinancingAmount', label: 'SubordinateFinancingAmount' },
    { key: 'PreWorkoutUPBAtTrial', label: 'PreWorkoutUPBAtTrial' },
    { key: 'LastGrossUPBReportedToSir', label: 'LastGrossUPBReportedToSir' },
    { key: 'TrialEligibilityDate', label: 'TrialEligibilityDate' },
    { key: 'LoanPaymentFrequencyCode', label: 'LoanPaymentFrequencyCode' },
    { key: 'LoanRemittanceTypeCode', label: 'LoanRemittanceTypeCode' },
    { key: 'PropertyRepairCostAmount', label: 'PropertyRepairCostAmount' },
    { key: 'DelinquentInterestThroughSubmissionDateAmount', label: 'DelinquentInterestThroughSubmissionDateAmount' },
    { key: 'LoanForeclosureSaleDateTypeCode', label: 'LoanForeclosureSaleDateTypeCode' },
    { key: 'BorrowerBankruptcyIndicator1', label: 'BorrowerBankruptcyIndicator1' },
    { key: 'BorrowerBankruptcyIndicator2', label: 'BorrowerBankruptcyIndicator2' },
    { key: 'BorrowerBankruptcyIndicator3', label: 'BorrowerBankruptcyIndicator3' },
    { key: 'BorrowerBankruptcyIndicator4', label: 'BorrowerBankruptcyIndicator4' },
    { key: 'BorrowerBankruptcyIndicator5', label: 'BorrowerBankruptcyIndicator5' },
    { key: 'BorrowerBankruptcyIndicator6', label: 'BorrowerBankruptcyIndicator6' },
    { key: 'LitigationDescriptionType', label: 'LitigationDescriptionType' },
    { key: 'LitigationStatusType', label: 'LitigationStatusType' },
    { key: 'LitigationStatusDate', label: 'LitigationStatusDate' },
    { key: 'LitigationSubjectPropertyIndicator', label: 'LitigationSubjectPropertyIndicator' },
    { key: 'LitigationTitleConveyanceLimitationIndicator', label: 'LitigationTitleConveyanceLimitationIndicator' },
    { key: 'BankruptcyReaffirmationIndicator', label: 'BankruptcyReaffirmationIndicator' },
    { key: 'OtherRelocationAssistanceAmount', label: 'OtherRelocationAssistanceAmount' },
    { key: 'PurchaseOfferReceivedDate', label: 'PurchaseOfferReceivedDate' },
    { key: 'PurchaseOfferAmount', label: 'PurchaseOfferAmount' },
    { key: 'PurchaseOfferClosingDate', label: 'PurchaseOfferClosingDate' },
    { key: 'NetSalesProceedsAmount', label: 'NetSalesProceedsAmount' },
    { key: 'SubjectPropertyMarketRentAmount', label: 'SubjectPropertyMarketRentAmount' },
    { key: 'DisasterName1', label: 'DisasterName1' },
    { key: 'DisasterName2', label: 'DisasterName2' },
    { key: 'DisasterName3', label: 'DisasterName3' },
    { key: 'ServicerAttorneyContactName', label: 'ServicerAttorneyContactName' },
    { key: 'ProvisionalPaymentPeriodAgreementDate', label: 'ProvisionalPaymentPeriodAgreementDate' },
    { key: 'IncomeTypeOtherDescription1', label: 'IncomeTypeOtherDescription1' },
    { key: 'IncomeTypeOtherDescription2', label: 'IncomeTypeOtherDescription2' },
    { key: 'IncomeTypeOtherDescription3', label: 'IncomeTypeOtherDescription3' },
    { key: 'IncomeTypeOtherDescription4', label: 'IncomeTypeOtherDescription4' },
    { key: 'IncomeTypeOtherDescription5', label: 'IncomeTypeOtherDescription5' },
    { key: 'IncomeTypeOtherDescription6', label: 'IncomeTypeOtherDescription6' },
    { key: 'BankruptcyFilingDate', label: 'BankruptcyFilingDate' },
    { key: 'CreditScoreType1', label: 'CreditScoreType1' },
    { key: 'CreditScoreType2', label: 'CreditScoreType2' },
    { key: 'CreditScoreType3', label: 'CreditScoreType3' },
    { key: 'CreditScoreType4', label: 'CreditScoreType4' },
    { key: 'CreditScoreType5', label: 'CreditScoreType5' },
    { key: 'CreditScoreType6', label: 'CreditScoreType6' },
    { key: 'NewMortgageObtainedIndicator', label: 'NewMortgageObtainedIndicator' },
    { key: 'DeathCertificateReceivedIndicator', label: 'DeathCertificateReceivedIndicator' },
    { key: 'OtherExpenseTypeDescription1', label: 'OtherExpenseTypeDescription1' },
    { key: 'OtherExpenseTypeDescription2', label: 'OtherExpenseTypeDescription2' },
    { key: 'OtherExpenseTypeDescription3', label: 'OtherExpenseTypeDescription3' },
    { key: 'OtherExpenseTypeDescription4', label: 'OtherExpenseTypeDescription4' },
    { key: 'OtherExpenseTypeDescription5', label: 'OtherExpenseTypeDescription5' },
    { key: 'OtherExpenseTypeDescription6', label: 'OtherExpenseTypeDescription6' },
    { key: 'ServicerImminentDefaultEvaluationDate', label: 'ServicerImminentDefaultEvaluationDate' },
    { key: 'Number30DaysDelinquentIn6Months', label: 'Number30DaysDelinquentIn6Months' },
    { key: 'BRPSubmissionIndicator', label: 'BRPSubmissionIndicator' },
    { key: 'RepaymentPlanTotalAmountDue', label: 'RepaymentPlanTotalAmountDue' },
    { key: 'NonFemaDisasterHardshipIndicator', label: 'NonFemaDisasterHardshipIndicator' },
    { key: 'MediationIndicator', label: 'MediationIndicator' },
    { key: 'BorrowerQRPCIndicator', label: 'BorrowerQRPCIndicator' },
    { key: 'LoanLastPaymentAppliedDate', label: 'LoanLastPaymentAppliedDate' },
    { key: 'LoanConsecutiveDelinquentMonthsCount', label: 'LoanConsecutiveDelinquentMonthsCount' },
    { key: 'LoanProcessingMonthIndicator', label: 'LoanProcessingMonthIndicator' },
    { key: 'BorrowerFailedNonDisasterTrialIndicator', label: 'BorrowerFailedNonDisasterTrialIndicator' },
    { key: 'BorrowerImpactedByCovid19Indicator', label: 'BorrowerImpactedByCovid19Indicator' },
    { key: 'LoanPrincipalDeferredAmount', label: 'LoanPrincipalDeferredAmount' },
    { key: 'LoanInterestDeferredAmount', label: 'LoanInterestDeferredAmount' },
    { key: 'BorrowerCOVID19DefaultIndicator', label: 'BorrowerCOVID19DefaultIndicator' },
    { key: 'BorrowerHardshipDueToNewDisasterEventIndicator', label: 'BorrowerHardshipDueToNewDisasterEventIndicator' },
    { key: 'BorrowerDisasterPaymentDeferralDefaultIndicator', label: 'BorrowerDisasterPaymentDeferralDefaultIndicator' },
    { key: 'BorrowerSpecialCreditReportingIndicator', label: 'BorrowerSpecialCreditReportingIndicator' },
    { key: 'LoanRPPContractualPaymentChangeMonth', label: 'LoanRPPContractualPaymentChangeMonth' },
    { key: 'LoanRPPContractualPaymentChangeAmount', label: 'LoanRPPContractualPaymentChangeAmount' },
    { key: 'BorrowerPaymentDeferralDefaultIndicator', label: 'BorrowerPaymentDeferralDefaultIndicator' },
    { key: 'LoanRecourseTypeCode', label: 'LoanRecourseTypeCode' },
    { key: 'AssumptionIndicator1', label: 'AssumptionIndicator1' },
    { key: 'IncludePSAEvaluationIndicator', label: 'IncludePSAEvaluationIndicator' },
    { key: 'BorrowerAttestationDocumentReceivedIndicator', label: 'BorrowerAttestationDocumentReceivedIndicator' },
    { key: 'DecisionVersion', label: 'DecisionVersion' },
    { key: 'WillingToRetainProperty', label: 'WillingToRetainProperty' },
    { key: 'LeaseholdPropertyTermsRemain', label: 'LeaseholdPropertyTermsRemain' },
    { key: 'RepaymentWithActiveOffer', label: 'RepaymentWithActiveOffer' },
    { key: 'ReinstatementViable', label: 'ReinstatementViable' },
    { key: 'GrossRentalIncome', label: 'GrossRentalIncome' },
    { key: 'ModificationTrialPlanEndDate', label: 'ModificationTrialPlanEndDate' },
    { key: 'PropertyPreservationAmount', label: 'PropertyPreservationAmount' },
    { key: 'PrResMortgagePITIAS', label: 'PrResMortgagePITIAS' },
    { key: 'ReportedFirstPaymentDueDate', label: 'ReportedFirstPaymentDueDate' },
    { key: 'SignedFinalDocsReceivedDate', label: 'SignedFinalDocsReceivedDate' },
    { key: 'TotalCashReserveAmount', label: 'TotalCashReserveAmount' },
    { key: 'HardshipReasonCommentforReasonOther', label: 'HardshipReasonCommentforReasonOther' },
    { key: 'DisasterType', label: 'DisasterType' },
    { key: 'DisasterCountyCode', label: 'DisasterCountyCode' },
    { key: 'AppealReviewRequestIndicator', label: 'AppealReviewRequestIndicator' },
    { key: 'AppealReviewRequestIdentifier', label: 'AppealReviewRequestIdentifier' },
    { key: 'BorrowerResponsePackageReceivedDate', label: 'BorrowerResponsePackageReceivedDate' },
    { key: 'BorrowerType', label: 'BorrowerType' },
    { key: 'Borrower1CreditScoreDate', label: 'Borrower1CreditScoreDate' },
    { key: 'Borrower2CreditScoreDate', label: 'Borrower2CreditScoreDate' }
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
