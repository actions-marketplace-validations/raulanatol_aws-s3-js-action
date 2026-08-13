import { getInput } from '@actions/core';

export interface InputParameters {
  awsBucketName: string;
  awsRegion: string;
  withDelete: boolean;
  target: string;
  source: string;
  withCloudfrontInvalidation: boolean;
  cloudFrontDistributionId: string;
  cloudFrontInvalidationPath: string;
}

const REQUIRED = { required: true };
const getRequiredInput = (input) => getInput(input, REQUIRED);

// WITH_CLOUD_FRONT_INVALIDATION is the spelling declared by older versions of action.yml.
const getCloudfrontInvalidationInput = (): string =>
  getInput('WITH_CLOUDFRONT_INVALIDATION') || getInput('WITH_CLOUD_FRONT_INVALIDATION');

const toBoolean = (input: string, defaultValue: boolean = false): boolean => {
  if (!input) {
    return defaultValue;
  }
  return input.toUpperCase() === 'TRUE';
};

export const getInputParameters = (): InputParameters => ({
  awsBucketName: getRequiredInput('AWS_BUCKET_NAME'),
  awsRegion: getRequiredInput('AWS_REGION'),
  source: getRequiredInput('SOURCE'),
  withDelete: toBoolean(getInput('WITH_DELETE'), false),
  target: getRequiredInput('TARGET'),
  withCloudfrontInvalidation: toBoolean(getCloudfrontInvalidationInput(), false),
  cloudFrontDistributionId: getInput('AWS_CLOUDFRONT_DISTRIBUTION_ID'),
  cloudFrontInvalidationPath: getInput('AWS_CLOUDFRONT_INVALIDATION_PATH')
});
