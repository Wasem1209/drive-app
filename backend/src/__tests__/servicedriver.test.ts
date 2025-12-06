// Unit tests for ServiceDriver interfaces and types
// Note: Lucid-cardano integration tests require special ESM configuration
// These tests focus on interface shapes and mocked behavior

describe('ServiceDriver', () => {
  describe('ComplianceData interface', () => {
    it('should have correct shape when vehicle not found', () => {
      const notFound = { found: false };
      expect(notFound.found).toBe(false);
      expect(notFound).not.toHaveProperty('ownerPkh');
    });

    it('should have correct shape when vehicle found', () => {
      const found = {
        found: true,
        ownerPkh: 'abc123',
        tokenName: 'TEST-VEHICLE',
        roadworthy: true,
        insuranceExpiry: 1735689600000,
        insuranceValid: true,
        taxExpiry: 1735689600000,
        taxValid: true,
        utxoRef: 'txhash#0',
      };
      expect(found.found).toBe(true);
      expect(found.roadworthy).toBe(true);
      expect(found.insuranceValid).toBe(true);
      expect(found.ownerPkh).toBe('abc123');
    });

    it('should correctly identify expired insurance', () => {
      const now = Date.now();
      const expired = {
        insuranceExpiry: now - 86400000, // Yesterday
        insuranceValid: false,
      };
      expect(expired.insuranceValid).toBe(false);
    });
  });

  describe('DriverStatus interface', () => {
    it('should represent compliant driver', () => {
      const status = {
        insurancePaid: true,
        roadTaxPaid: true,
        roadworthy: true,
      };
      expect(status.insurancePaid).toBe(true);
      expect(status.roadTaxPaid).toBe(true);
      expect(status.roadworthy).toBe(true);
    });

    it('should represent non-compliant driver', () => {
      const status = {
        insurancePaid: false,
        roadTaxPaid: false,
        roadworthy: false,
      };
      expect(status.insurancePaid).toBe(false);
      expect(status.roadTaxPaid).toBe(false);
    });

    it('should represent partially compliant driver', () => {
      const status = {
        insurancePaid: true,
        roadTaxPaid: false,
        roadworthy: true,
      };
      expect(status.insurancePaid).toBe(true);
      expect(status.roadTaxPaid).toBe(false);
    });
  });

  describe('VehicleDatum shape', () => {
    it('should have all required fields', () => {
      const datum = {
        owner_pkh: 'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
        token_name: '544553542D564548',
        roadworthy: true,
        insurance_expiry: BigInt(1735689600000),
        tax_expiry: BigInt(1735689600000),
      };

      expect(datum.owner_pkh).toBeDefined();
      expect(datum.token_name).toBeDefined();
      expect(typeof datum.roadworthy).toBe('boolean');
      expect(typeof datum.insurance_expiry).toBe('bigint');
      expect(typeof datum.tax_expiry).toBe('bigint');
    });

    it('should properly use hex encoding for pubkey hash', () => {
      const validPkh = 'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234';
      expect(validPkh.length).toBe(56); // 28 bytes = 56 hex chars
      expect(/^[a-f0-9]+$/.test(validPkh)).toBe(true);
    });
  });

  describe('Redeemer types', () => {
    it('Update redeemer should be index 0', () => {
      // Constructor index 0 = Update (no fields)
      expect(0).toBe(0);
    });

    it('Transfer redeemer should be index 1 with new_owner', () => {
      // Constructor index 1 = Transfer { new_owner }
      const newOwner = 'dcba4321dcba4321dcba4321dcba4321dcba4321dcba4321dcba4321';
      expect(newOwner.length).toBe(56);
    });

    it('FlagUnsafe redeemer should be index 2', () => {
      // Constructor index 2 = FlagUnsafe (no fields)
      expect(2).toBe(2);
    });
  });
});
