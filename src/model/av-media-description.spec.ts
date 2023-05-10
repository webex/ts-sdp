import { ExtMapLine, MediaLine } from '../lines';
import { AvMediaDescription } from './av-media-description';

describe('avMediaDescription', () => {
  let avMediaDescription: AvMediaDescription;
  beforeEach(() => {
    const mediaLine = new MediaLine('video', 9, 'proto', ['99', '100']);
    avMediaDescription = new AvMediaDescription(mediaLine);
  });
  describe('addExtension', () => {
    // eslint-disable-next-line jsdoc/require-jsdoc
    const getExtByUri = (extMaps: Map<number, ExtMapLine>, uri: string): ExtMapLine | undefined => {
      return [...extMaps.values()].find((eml) => eml.uri === uri);
    };
    it('should add the extension correctly', () => {
      expect.hasAssertions();
      avMediaDescription.addExtension({ uri: 'some_ext_uri' });
      expect(avMediaDescription.extMaps.size).toBe(1);
      const addedLine = getExtByUri(avMediaDescription.extMaps, 'some_ext_uri');
      expect(addedLine).toBeDefined();
      expect(addedLine?.id).toBe(1);
    });

    it('should allow specifying the ID when adding', () => {
      expect.hasAssertions();
      avMediaDescription.addExtension({ uri: 'some_ext_uri', id: 7 });
      const addedLine = getExtByUri(avMediaDescription.extMaps, 'some_ext_uri');
      expect(addedLine).toBeDefined();
      expect(addedLine?.id).toBe(7);
    });

    it('should find the first free ID when one is not specified', () => {
      expect.hasAssertions();
      avMediaDescription.addExtension({ uri: 'some_ext_uri', id: 1 });
      avMediaDescription.addExtension({ uri: 'some_ext_uri2', id: 2 });
      avMediaDescription.addExtension({ uri: 'some_ext_uri4', id: 4 });
      avMediaDescription.addExtension({ uri: 'some_ext_uri3' });
      const addedLine = getExtByUri(avMediaDescription.extMaps, 'some_ext_uri3');
      expect(addedLine).toBeDefined();
      expect(addedLine?.id).toBe(3);
    });

    it('should throw if a duplicate ext ID is added', () => {
      expect.hasAssertions();
      avMediaDescription.addExtension({ uri: 'some_ext_uri' });
      expect(() => avMediaDescription.addExtension({ uri: 'some_ext_uri1', id: 1 })).toThrow(
        'Extension with ID 1 already exists'
      );
    });
  });
});
