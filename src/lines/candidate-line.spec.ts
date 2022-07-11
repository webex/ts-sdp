import { CandidateLine } from './candidate-line';

describe('candidate line', () => {
  it('should parse a basic candidate line correctly', () => {
    expect.hasAssertions();
    const line = 'candidate:1 1 UDP 2130706431 203.0.113.141 8998 typ host';
    const result = CandidateLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.foundation).toBe('1');
    expect(result?.componentId).toBe(1);
    expect(result?.transport).toBe('UDP');
    expect(result?.priority).toBe(2130706431);
    expect(result?.connectionAddress).toBe('203.0.113.141');
    expect(result?.port).toBe(8998);
    expect(result?.candidateType).toBe('host');
    expect(result?.relAddr).toBeUndefined();
    expect(result?.relPort).toBeUndefined();
    expect(result?.candidateExtensions).toBeUndefined();
    expect(result?.toSdpLine()).toBe('a=candidate:1 1 UDP 2130706431 203.0.113.141 8998 typ host');
  });

  it('should parse a line with relative address and relative port correctly', () => {
    expect.hasAssertions();
    const line =
      'candidate:2 1 UDP 1694498815 192.0.2.3 45664 typ srflx raddr 203.0.113.141 rport 8998';
    const result = CandidateLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.foundation).toBe('2');
    expect(result?.componentId).toBe(1);
    expect(result?.transport).toBe('UDP');
    expect(result?.priority).toBe(1694498815);
    expect(result?.connectionAddress).toBe('192.0.2.3');
    expect(result?.port).toBe(45664);
    expect(result?.candidateType).toBe('srflx');
    expect(result?.relAddr).toBe('203.0.113.141');
    expect(result?.relPort).toBe(8998);
    expect(result?.candidateExtensions).toBeUndefined();
    expect(result?.toSdpLine()).toBe(
      'a=candidate:2 1 UDP 1694498815 192.0.2.3 45664 typ srflx raddr 203.0.113.141 rport 8998'
    );
  });

  it('should parse a line with candidate extensions correctly', () => {
    expect.hasAssertions();
    const line = 'candidate:2 1 UDP 1694498815 192.0.2.3 45664 typ srflx ext-one abc ext-two 123';
    const result = CandidateLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.foundation).toBe('2');
    expect(result?.componentId).toBe(1);
    expect(result?.transport).toBe('UDP');
    expect(result?.priority).toBe(1694498815);
    expect(result?.connectionAddress).toBe('192.0.2.3');
    expect(result?.port).toBe(45664);
    expect(result?.candidateType).toBe('srflx');
    expect(result?.relAddr).toBeUndefined();
    expect(result?.relPort).toBeUndefined();
    expect(result?.candidateExtensions).toBe('ext-one abc ext-two 123');
    expect(result?.toSdpLine()).toBe(
      'a=candidate:2 1 UDP 1694498815 192.0.2.3 45664 typ srflx ext-one abc ext-two 123'
    );
  });

  it('should not parse a line with invalid foundation', () => {
    expect.hasAssertions();
    const line = 'candidate:4234997325- 1 UDP 2130706431 192.0.2.1 3478 typ host';
    const result = CandidateLine.fromSdpLine(line);

    expect(result).toBeFalsy();
  });
});
