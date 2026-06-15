package com.resumeanalyzer.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class TextExtractionService {

    private final Tika tika = new Tika();

    public String extractText(MultipartFile file) throws IOException, TikaException {
        try (InputStream stream = file.getInputStream()) {
            String raw = tika.parseToString(stream);
            return raw == null ? "" : raw.replaceAll("\\s{2,}", " ").trim();
        }
    }
}
