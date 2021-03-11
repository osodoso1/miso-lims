package uk.ac.bbsrc.tgac.miso.core.service.printing;

import java.io.IOException;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Stream;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import uk.ac.bbsrc.tgac.miso.core.data.Barcodable;
import uk.ac.bbsrc.tgac.miso.core.data.Barcodable.EntityType;
import uk.ac.bbsrc.tgac.miso.core.data.BarcodableVisitor;
import uk.ac.bbsrc.tgac.miso.core.data.Box;
import uk.ac.bbsrc.tgac.miso.core.data.Instrument;
import uk.ac.bbsrc.tgac.miso.core.data.Kit;
import uk.ac.bbsrc.tgac.miso.core.data.Library;
import uk.ac.bbsrc.tgac.miso.core.data.Pair;
import uk.ac.bbsrc.tgac.miso.core.data.Pool;
import uk.ac.bbsrc.tgac.miso.core.data.Sample;
import uk.ac.bbsrc.tgac.miso.core.data.SequencerPartitionContainer;
import uk.ac.bbsrc.tgac.miso.core.data.Workstation;
import uk.ac.bbsrc.tgac.miso.core.data.impl.LibraryAliquot;
import uk.ac.bbsrc.tgac.miso.core.data.impl.SequencingContainerModel;
import uk.ac.bbsrc.tgac.miso.core.service.printing.LabelCanvas.FontStyle;

public final class TypeAlternate implements PrintableText {
  private final Map<Barcodable.EntityType, PrintableText> options;

  public TypeAlternate(Map<Barcodable.EntityType, PrintableText> options) {
    this.options = options;
  }

  private PrintableText alternateFor(Barcodable barcodable) {
    return options.getOrDefault(barcodable.visit(new BarcodableVisitor<Barcodable.EntityType>() {

      @Override
      public EntityType visitBox(Box box) {
        return EntityType.BOX;
      }

      @Override
      public EntityType visitContainer(SequencerPartitionContainer container) {
        return EntityType.CONTAINER;
      }

      @Override
      public EntityType visitContainerModel(SequencingContainerModel model) {
        return EntityType.CONTAINER_MODEL;
      }

      @Override
      public EntityType visitKit(Kit kit) {
        return EntityType.KIT;
      }

      @Override
      public EntityType visitLibrary(Library library) {
        return EntityType.LIBRARY;
      }

      @Override
      public EntityType visitLibraryAliquot(LibraryAliquot libraryAliquot) {
        return EntityType.LIBRARY_ALIQUOT;
      }

      @Override
      public EntityType visitPool(Pool pool) {
        return EntityType.POOL;
      }

      @Override
      public EntityType visitSample(Sample sample) {
        return EntityType.SAMPLE;
      }

      @Override
      public EntityType visitWorkstation(Workstation workstation) {
        return EntityType.WORKSTATION;
      }

      @Override
      public EntityType visitInstrument(Instrument instrument) {
        return EntityType.INSTRUMENT;
      }
    }), PrintableText.NULL);
  }

  @Override
  public JsonNode asJson() {
    final ObjectNode node = JsonNodeFactory.instance.objectNode();
    for (Entry<Barcodable.EntityType, PrintableText> option : options.entrySet()) {
      node.set(option.getKey().name(), option.getValue().asJson());
    }
    return node;
  }

  @Override
  public void asJson(JsonGenerator generator) throws IOException, JsonProcessingException {
    generator.writeStartObject();
    for (final Map.Entry<EntityType, PrintableText> entry : options.entrySet()) {
      generator.writeFieldName(entry.getKey().name());
      entry.getValue().asJson(generator);
    }
    generator.writeEndObject();
  }

  @Override
  public Pair<FontStyle, String> line(Barcodable barcodable) {
    return alternateFor(barcodable).line(barcodable);
  }

  @Override
  public Stream<Pair<FontStyle, String>> lines(Barcodable barcodable) {
    return alternateFor(barcodable).lines(barcodable);
  }

  @Override
  public String text(Barcodable barcodable) {
    return alternateFor(barcodable).text(barcodable);
  }

}
