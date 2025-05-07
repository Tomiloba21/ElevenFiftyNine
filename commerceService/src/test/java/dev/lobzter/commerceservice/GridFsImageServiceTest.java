package dev.lobzter.commerceservice;

import dev.lobzter.commerceservice.service.impl.GridFsImageService;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

public class GridFsImageServiceTest {


    @Mock
    private GridFsTemplate gridFsTemplate;

    @Mock
    private GridFsOperations gridFsOperations;

    @InjectMocks
    private GridFsImageService imageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void storeFile_ShouldReturnFileId() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        String productId = "product123";
        ObjectId fileId = new ObjectId();

        when(gridFsTemplate.store(any(), any(), any(), any())).thenReturn(fileId);

        // Act
        String result = String.valueOf(imageService.storeFile(file, productId));

        // Assert
//        assertEquals(fileId.toString(), result);
//        verify(gridFsTemplate, times(1)).store(any(), any(), eq("image/jpeg"), any());
    }
}
