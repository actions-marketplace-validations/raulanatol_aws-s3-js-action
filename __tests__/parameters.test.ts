import { getInputParameters } from '../src/parameters';

const REQUIRED_INPUTS = {
  INPUT_AWS_BUCKET_NAME: 'a-bucket',
  INPUT_AWS_REGION: 'eu-west-1',
  INPUT_SOURCE: './build',
  INPUT_TARGET: '/'
};

const withInputs = (inputs: Record<string, string>) => {
  for (const [key, value] of Object.entries({ ...REQUIRED_INPUTS, ...inputs })) {
    process.env[key] = value;
  }
};

describe('getInputParameters', () => {
  beforeEach(() => {
    for (const key of Object.keys(process.env)) {
      if (key.startsWith('INPUT_')) {
        delete process.env[key];
      }
    }
  });

  it('should read the required inputs', () => {
    withInputs({});

    expect(getInputParameters()).toMatchObject({
      awsBucketName: 'a-bucket',
      awsRegion: 'eu-west-1',
      source: './build',
      target: '/'
    });
  });

  it('should default the optional flags to false', () => {
    withInputs({});

    const { withDelete, withCloudfrontInvalidation } = getInputParameters();

    expect(withDelete).toBe(false);
    expect(withCloudfrontInvalidation).toBe(false);
  });

  it('should read the flags case-insensitively', () => {
    withInputs({ INPUT_WITH_DELETE: 'true' });

    expect(getInputParameters().withDelete).toBe(true);
  });

  it('should treat any other value as false', () => {
    withInputs({ INPUT_WITH_DELETE: 'yes' });

    expect(getInputParameters().withDelete).toBe(false);
  });

  it('should read the cloudfront invalidation flag', () => {
    withInputs({ INPUT_WITH_CLOUDFRONT_INVALIDATION: 'TRUE' });

    expect(getInputParameters().withCloudfrontInvalidation).toBe(true);
  });

  it('should read the cloudfront invalidation flag from the deprecated alias', () => {
    withInputs({ INPUT_WITH_CLOUD_FRONT_INVALIDATION: 'TRUE' });

    expect(getInputParameters().withCloudfrontInvalidation).toBe(true);
  });

  it('should prefer the current spelling over the deprecated alias', () => {
    withInputs({
      INPUT_WITH_CLOUDFRONT_INVALIDATION: 'FALSE',
      INPUT_WITH_CLOUD_FRONT_INVALIDATION: 'TRUE'
    });

    expect(getInputParameters().withCloudfrontInvalidation).toBe(false);
  });

  it('should fail when a required input is missing', () => {
    expect(() => getInputParameters()).toThrow();
  });
});
