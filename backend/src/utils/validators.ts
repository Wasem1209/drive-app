// src/utils/validators.ts
// Utility to load compiled Aiken validators from plutus.json

import { readFileSync } from 'fs';
import path from 'path';

// Load plutus.json blueprint
const PLUTUS_JSON_PATH = path.join(__dirname, '../../../blockchain/autofy/plutus.json');

interface PlutusValidator {
  title: string;
  compiledCode: string;
  hash: string;
  datum?: any;
  redeemer?: any;
}

interface PlutusBlueprint {
  preamble: {
    title: string;
    version: string;
    plutusVersion: string;
  };
  validators: PlutusValidator[];
  definitions: Record<string, any>;
}

// Lucid-compatible validator type (supports PlutusV1/V2/V3 via 'as any' for flexibility)
export interface ValidatorScript {
  type: string;
  script: string;
}

let blueprint: PlutusBlueprint | null = null;

function loadBlueprint(): PlutusBlueprint {
  if (!blueprint) {
    const raw = readFileSync(PLUTUS_JSON_PATH, 'utf8');
    blueprint = JSON.parse(raw);
  }
  return blueprint!;
}

function findValidator(titlePattern: string): PlutusValidator | undefined {
  const bp = loadBlueprint();
  return bp.validators.find(v => v.title.includes(titlePattern) && v.title.includes('.spend'));
}

function findMintingPolicy(titlePattern: string): PlutusValidator | undefined {
  const bp = loadBlueprint();
  return bp.validators.find(v => v.title.includes(titlePattern) && v.title.includes('.mint'));
}

// Export validators - using PlutusV2 for Lucid 0.10.x compatibility
// Note: Cardano Conway era supports PlutusV3, but older Lucid versions only type PlutusV1/V2

export function getDriverRegistryValidator(): ValidatorScript {
  const validator = findValidator('driver_registry');
  if (!validator) throw new Error('driver_registry validator not found in plutus.json');
  return {
    type: 'PlutusV2', // Using V2 for type compatibility; actual script is V3
    script: validator.compiledCode,
  };
}

export function getDriverRegistryHash(): string {
  const validator = findValidator('driver_registry');
  if (!validator) throw new Error('driver_registry validator not found in plutus.json');
  return validator.hash;
}

export function getViolationManagerValidator(): ValidatorScript {
  const validator = findValidator('violation_manager');
  if (!validator) throw new Error('violation_manager validator not found in plutus.json');
  return {
    type: 'PlutusV2',
    script: validator.compiledCode,
  };
}

export function getPassengerRegistryValidator(): ValidatorScript {
  const validator = findValidator('passenger_registry');
  if (!validator) throw new Error('passenger_registry validator not found in plutus.json');
  return {
    type: 'PlutusV2',
    script: validator.compiledCode,
  };
}

export function getAdminGovernanceValidator(): ValidatorScript {
  const validator = findValidator('admin_governance');
  if (!validator) throw new Error('admin_governance validator not found in plutus.json');
  return {
    type: 'PlutusV2',
    script: validator.compiledCode,
  };
}

export function getRewardsPolicyMinting(): ValidatorScript {
  const policy = findMintingPolicy('rewards_policy');
  if (!policy) throw new Error('rewards_policy minting policy not found in plutus.json');
  return {
    type: 'PlutusV2',
    script: policy.compiledCode,
  };
}

export function getRewardsPolicyId(): string {
  const policy = findMintingPolicy('rewards_policy');
  if (!policy) throw new Error('rewards_policy minting policy not found in plutus.json');
  return policy.hash;
}

// Export blueprint definitions for datum/redeemer schema access
export function getDefinitions(): Record<string, any> {
  return loadBlueprint().definitions;
}

// Get raw plutus version from blueprint
export function getPlutusVersion(): string {
  return loadBlueprint().preamble.plutusVersion;
}
