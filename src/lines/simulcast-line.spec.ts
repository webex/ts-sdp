import { SimulcastLayerList, SimulcastLine } from './simulcast-line';

describe('simulcastlayerlist', () => {
  it('should parse a string with 2 layers correctly', () => {
    expect.hasAssertions();
    const result = SimulcastLayerList.fromString('1;2');
    expect(result.layers).toHaveLength(2);

    expect(result.layers[0]).toHaveLength(1);
    expect(result.layers[0][0].id).toBe('1');
    expect(result.layers[0][0].paused).toBe(false);

    expect(result.layers[1]).toHaveLength(1);
    expect(result.layers[1][0].id).toBe('2');
    expect(result.layers[1][0].paused).toBe(false);
  });

  it('should parse a string with alternatives correctly', () => {
    expect.hasAssertions();
    const result = SimulcastLayerList.fromString('1,~2;3');
    expect(result.layers).toHaveLength(2);

    expect(result.layers[0]).toHaveLength(2);
    expect(result.layers[0][0].id).toBe('1');
    expect(result.layers[0][0].paused).toBe(false);
    expect(result.layers[0][1].id).toBe('2');
    expect(result.layers[0][1].paused).toBe(true);

    expect(result.layers[1]).toHaveLength(1);
    expect(result.layers[1][0].id).toBe('3');
    expect(result.layers[1][0].paused).toBe(false);
  });

  it('should throw an error if the stream list is empty', () => {
    expect.hasAssertions();
    expect(() => SimulcastLayerList.fromString('')).toThrow('simulcast stream list empty');
  });

  it('should throw an error if the layer list is empty', () => {
    expect.hasAssertions();
    expect(() => SimulcastLayerList.fromString(';')).toThrow('simulcast layer list empty');
  });

  it('should throw an error if a rid is empty', () => {
    expect.hasAssertions();
    expect(() => SimulcastLayerList.fromString(',;')).toThrow('rid empty');
  });

  it('should serialize to a string correctly', () => {
    expect.hasAssertions();
    expect(SimulcastLayerList.fromString('1,~2;3').toString()).toBe('1,~2;3');
  });
});

describe('simulcastline', () => {
  it('should parse a simple, single direction simulcast line correctly', () => {
    expect.hasAssertions();
    const result = SimulcastLine.fromSdpLine('simulcast:send 1;2;3');
    expect(result).toBeTruthy();
    expect(result?.sendLayers).toHaveLength(3);
    expect(result?.recvLayers).toHaveLength(0);

    expect(result?.sendLayers.get(0)).toHaveLength(1);
    expect(result?.sendLayers.get(0)?.[0]?.id).toBe('1');
    expect(result?.sendLayers.get(0)?.[0]?.paused).toBe(false);

    expect(result?.sendLayers.get(1)).toHaveLength(1);
    expect(result?.sendLayers.get(1)?.[0]?.id).toBe('2');
    expect(result?.sendLayers.get(1)?.[0]?.paused).toBe(false);

    expect(result?.sendLayers.get(2)).toHaveLength(1);
    expect(result?.sendLayers.get(2)?.[0]?.id).toBe('3');
    expect(result?.sendLayers.get(2)?.[0]?.paused).toBe(false);
  });

  it('should parse a bidirectional simulcast line correctly', () => {
    expect.hasAssertions();
    const result = SimulcastLine.fromSdpLine('simulcast:send 1;2;3 recv 4;5;6');
    expect(result).toBeTruthy();
    expect(result?.sendLayers).toHaveLength(3);
    expect(result?.recvLayers).toHaveLength(3);

    expect(result?.sendLayers.get(0)).toHaveLength(1);
    expect(result?.sendLayers.get(0)?.[0]?.id).toBe('1');
    expect(result?.sendLayers.get(0)?.[0]?.paused).toBe(false);

    expect(result?.sendLayers.get(1)).toHaveLength(1);
    expect(result?.sendLayers.get(1)?.[0]?.id).toBe('2');
    expect(result?.sendLayers.get(1)?.[0]?.paused).toBe(false);

    expect(result?.sendLayers.get(2)).toHaveLength(1);
    expect(result?.sendLayers.get(2)?.[0]?.id).toBe('3');
    expect(result?.sendLayers.get(2)?.[0]?.paused).toBe(false);

    expect(result?.recvLayers.get(0)).toHaveLength(1);
    expect(result?.recvLayers.get(0)?.[0]?.id).toBe('4');
    expect(result?.recvLayers.get(0)?.[0]?.paused).toBe(false);

    expect(result?.recvLayers.get(1)).toHaveLength(1);
    expect(result?.recvLayers.get(1)?.[0]?.id).toBe('5');
    expect(result?.recvLayers.get(1)?.[0]?.paused).toBe(false);

    expect(result?.recvLayers.get(2)).toHaveLength(1);
    expect(result?.recvLayers.get(2)?.[0]?.id).toBe('6');
    expect(result?.recvLayers.get(2)?.[0]?.paused).toBe(false);
  });

  it('should parse a simulcast line with alternatives correctly', () => {
    expect.hasAssertions();
    const result = SimulcastLine.fromSdpLine('simulcast:send 1,2;3');
    expect(result).toBeTruthy();
    expect(result?.sendLayers).toHaveLength(2);

    expect(result?.sendLayers.get(0)).toHaveLength(2);
    expect(result?.sendLayers.get(0)?.[0]?.id).toBe('1');
    expect(result?.sendLayers.get(0)?.[0]?.paused).toBe(false);
    expect(result?.sendLayers.get(0)?.[1]?.id).toBe('2');
    expect(result?.sendLayers.get(0)?.[1]?.paused).toBe(false);

    expect(result?.sendLayers.get(1)).toHaveLength(1);
    expect(result?.sendLayers.get(1)?.[0]?.id).toBe('3');
    expect(result?.sendLayers.get(1)?.[0]?.paused).toBe(false);
  });

  it('should parse the directions in either order', () => {
    expect.hasAssertions();
    const result = SimulcastLine.fromSdpLine('simulcast:recv 1 send 2');
    expect(result).toBeTruthy();
    expect(result?.sendLayers).toHaveLength(1);
    expect(result?.recvLayers).toHaveLength(1);

    expect(result?.sendLayers.get(0)).toHaveLength(1);
    expect(result?.sendLayers.get(0)?.[0].id).toBe('2');

    expect(result?.recvLayers.get(0)).toHaveLength(1);
    expect(result?.recvLayers.get(0)?.[0].id).toBe('1');
  });

  it('should fail if two of the same direction is given', () => {
    expect.hasAssertions();
    const result = SimulcastLine.fromSdpLine('simulcast:send 1 send 2');
    expect(result).toBeFalsy();
  });

  it('should serialize to a string correctly', () => {
    expect.hasAssertions();
    expect(SimulcastLine.fromSdpLine('simulcast:send 1,2,3 recv 4,5,6')?.toSdpLine()).toBe(
      'a=simulcast:send 1,2,3 recv 4,5,6'
    );
    expect(SimulcastLine.fromSdpLine('simulcast:recv 4,5,6 send 1,2,3')?.toSdpLine()).toBe(
      'a=simulcast:send 1,2,3 recv 4,5,6'
    );
    expect(SimulcastLine.fromSdpLine('simulcast:send 1,2,3')?.toSdpLine()).toBe(
      'a=simulcast:send 1,2,3'
    );
    expect(SimulcastLine.fromSdpLine('simulcast:send 1,~2,~3')?.toSdpLine()).toBe(
      'a=simulcast:send 1,~2,~3'
    );
  });
});
